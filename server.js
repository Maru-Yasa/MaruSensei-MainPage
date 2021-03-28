const express = require('express')
const app = express()
require('dotenv').config

app.set('view engine','ejs')
app.use(express.static('static'))
app.get('/', (req,res) => {
    res.render('index')
})

app.listen(process.env.PORT, () => {
    console.log('server ok 3000')
})