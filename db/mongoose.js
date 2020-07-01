const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1:27017/web_crawler',
    // function(err, db) {
    //     db.collection('datas').drop().then(() => {
    //         console.log('Deleted Previous Content!')
    //     }).catch((err) => {
    //         console.log('No previous content')
    //     })
    // },
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
    console.log('connected to mongodb server')
}).catch((e) => {
    console.log('Error while attempting to connecting to mongodb')
    console.log(e)
})

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

module.exports = {
    mongoose
}