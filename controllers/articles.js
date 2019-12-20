let async = require('async')
let express = require('express')
let db = require('../models')
let router = express.Router()
let generalError = require('../loggers/generalError')

// POST /articles - create a new post anf get redirected to all articles
router.post('/', (req, res) => {
  let tags = []
  if (req.body.tags) {
    tags = req.body.tags.split(',')
  }

  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(article => {
    if (tags.length) {
      // MORE BETTER!
      async.forEach(tags, (t, done) => {
        db.tag.findOrCreate({
          where: { content: t.trim() }
        })
        .then(([tag, wasCreated]) => {
          article.addTag(tag)
          .then(() => {
            done()
          })
          .catch(done) // End of adding to join table
        })
        .catch(done) // End of finding or creating tag
      }, () => {
        // Executes one time only when entire list is complete
        // (all done functions have been called for each iteration)
        res.redirect('/articles/' + article.id)
      })
    }
    else {
      res.redirect('/articles/' + article.id)
    }
  })
  .catch(generalError)
})

// GET /articles/new - display form for creating new articles
router.get('/new', function(req, res) {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch(generalError)
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment, db.tag]
  })
  .then((article) => {
    if (!article) throw Error()
    res.render('articles/show', { article })
  })
  .catch(generalError)
})

module.exports = router
