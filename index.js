const request = require('request')
const cheerio = require('cheerio')
const promise = require('promise')
require('./db/mongoose')
const Data = require('./model/data')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, 'public')

app.use(express.static(publicDirectory))

const findXmlLinks = async(URL) => {
    return new promise(function(resolve, reject) {
        request(URL, function(err, res, body) {
            if (err) {
                console.log(err)
                return reject(err)
            } else {
                const xmlLinks = []
                const $ = cheerio.load(body, {
                    xmlMode: true
                })
                const sitemap = $('sitemap')
                sitemap.each(function(i, e) {
                    const location = $(this).find('loc').text()
                    xmlLinks[i] = location
                })
                return resolve(xmlLinks)
            }

        })

    })
}

const findWebpage = async(links) => {
    return new promise(function(resolve, reject) {
        links.forEach(website => {
            request(website, function(err, res, body) {
                if (err) {
                    return reject(err)
                } else {
                    const $ = cheerio.load(body, {
                        xmlMode: true
                    })
                    $('url').each(function(index) {
                        const location = $(this).find('loc').text();
                        const lastModDate = $(this).find('lastmod').text();
                        getContent({ location, lastModDate, website }).then(async function(content) {
                            const data = new Data({
                                heading: content.heading,
                                lastModDate: content.lastModDate,
                                website: content.location
                            })
                            try {
                                console.log(data)
                                await data.save()
                                console.log(location + ' Data saved!')
                            } catch (e) {
                                console.log(e)
                            }
                        })
                    })
                }
            })
        })
    })
}

getContent = ({ location, lastModDate, website }) => {
    return new promise(function(resolve, reject) {
        request(location, function(err, res, body) {
            if (err) {
                return reject(err)
            } else {
                const heading = []
                const $ = cheerio.load(body)
                $('h2').each(function(i, e) {
                    heading.push($(e).text())
                })
                return resolve({ heading, location, lastModDate })
            }
        })
    })
}


app.get('/toDatabase', (req, res) => {
    if (!req.query.url) {
        return res.send({
            status: 'Provide an URL'
        })
    }
    console.log(req.query)
    findXmlLinks(req.query.url + '/sitemap.xml').then(function(links) {
            findWebpage(links)
        }).then(() => {
            return res.send({
                status: 'success'
            })
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/search', (req, res) => {
    if (!(req.query.from || req.query.to)) {
        return res.send({
            status: 'Provide an URL'
        })
    }
    console.log(req.query)
    fs.createWriteStream('data.txt')
    Data.find({ "lastModDate": { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } })
        .then((data) => {
            if (data.length === 0) {
                return res.send({
                    error: 'No data'
                })
            }
            for (var key in data) {
                fs.appendFile('data.txt', JSON.stringify({
                    heading: data[key].heading,
                    website: data[key].website,
                    lastModDate: data[key].lastModDate
                }), (err) => {
                    if (err) throw err
                    console.log('saved!')
                })
            }
            return res.send({
                status: 'success'
            })
        }).catch((e) => {
            console.log(e)
        })
})



app.get('/download', (req, res) => {
    res.download(__dirname + '/data.txt')
})


app.listen(port, () => {
    console.log('Server running on port ', port)
})