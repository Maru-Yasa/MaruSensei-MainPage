const express = require('express')
const app = express()

app.set('view engine','ejs')
app.use(express.static('static'))
app.get('/', (req,res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('server ok 3000')
})