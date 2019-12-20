var express = require('express')
var ejsLayouts = require('express-ejs-layouts')
var db = require('./models') //access database tables
var moment = require('moment') //used for formatting dates
var rowdy = require('rowdy-logger') //used to render table of express routes
var app = express()

rowdy.begin(app)

app.set('view engine', 'ejs')

app.use(require('morgan')('dev'))
app.use(express.urlencoded({ extended: false })) //body parser
app.use(ejsLayouts)
app.use(express.static(__dirname + '/public/')) //_dirname is method used to get current directory of file

// middleware that allows us to access the 'moment' library in every EJS view (custom)
app.use(function(req, res, next) {
  res.locals.moment = moment
  next()
})

// GET / - display all articles and their authors
app.get('/', function(req, res) {
  db.article.findAll({
    include: [db.author]
  }).then(function(articles) {
    res.render('main/index', { articles: articles })
  }).catch(function(error) {
    console.log(error)
    res.status(400).render('main/404')
  })
})

// bring in authors and articles controllers
app.use('/authors', require('./controllers/authors'))
app.use('/articles', require('./controllers/articles'))
app.use('/comments', require('./controllers/comments'))
app.use('/tags', require('./controllers/tags'))

var server = app.listen(process.env.PORT || 3000, function() {
  rowdy.print()
})

module.exports = server
