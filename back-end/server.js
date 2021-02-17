const express = require('express')
const bodyparser = require('body-parser')


const app = express()
//const path = require('path')
const port = 3000;

// Statische bestanden
app.use(express.static('static/public'))
app.use('/css', express.static(__dirname + 'static/public/css'))
app.use('/js', express.static(__dirname + 'static/public/js'))
app.use('/assets', express.static(__dirname + 'static/public/assets'))


app.set('view engine','ejs')

app.get('', (req, res) => {
  res.render('index.ejs')
})

app.get('/home', (req, res) => {
  res.render('index.ejs')
})

app.get('/about', (req, res) => {
  res.render('about.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


