const cheerio = require('cheerio')
const request = require('request')

const url = 'https://inc42.com/' + 'sitemap.xml'

const findXmlLinks = (URL) => {
    request(URL, function(err, res, body) {
        if (err) {
            console.log(err)
            return
        } else {
            const xmlLinks_ = []
            const $ = cheerio.load(body, {
                xmlMode: true
            })
            const sitemap = $('sitemap')
            sitemap.each(function(i, e) {
                const location = $(this).find('loc').text()
                xmlLinks_[i] = location
            })
            xmlLinks_.forEach(function(location) {
                // console.log(location)
                request(location, function(err, res, body) {
                    if (err) {
                        console.log(err)
                    } else {
                        const pageData = []
                        const $ = cheerio.load(body, {
                            xmlMode: true
                        })
                        $('url').each(function(index) {
                            const location = $(this).find('loc').text();
                            const lastMod = $(this).find('lastmod').text();
                            pageData[index] = { location, lastMod }
                        })
                        pageData.forEach(function({ location, lastMod }) {
                            findPageData({ location, lastMod })
                        })
                    }
                })
            })
        }
    })
}

const findPageData = ({ location, lastMod }) => {
    request(location, function(err, res, body) {
        if (err) {
            console.log(err)
        } else {
            var $ = cheerio.load(body)
            var heading = []
            $('h2').each(function(i, elem) {
                heading.push($(elem).text())
            })
            console.log(heading)
        }
    })
}


findXmlLinks(url)