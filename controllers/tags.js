let router = require('express').Router()
let db = require('../models')
let async = require('async')

router.get('/', (req, res) => {
  db.tag.findAll({
    include: [db.article]
  })
  .then(tags => {
    res.render('tags/index', { tags })
  })
  .catch(err => {
    console.log(err)
    res.send('Error')
  })
})

router.get('/:id', (req, res) => {
  db.tag.findOne({
    where: { id: req.params.id },
    include: [db.article]
  })
  .then(tag => {
    db.article.findAll()
    .then(articles => {
      res.render('tags/show', { tag, articles })
    })
  })
  .catch(err => console.log(err))
})

router.post('/:id/articles', (req, res) => {
  db.tag.findByPk(req.params.id)
  .then(tag => {
    async.forEach(req.body.articles, (articleId, done) => {
      tag.addArticle(articleId)
      .then(() => {
        done()
      })
      .catch(done)
    }, () => {
      res.redirect('/tags/' + req.params.id)
    })
  })
  .catch(err => {
    console.log('Nope', err)
    res.send('Error')
  })
})

module.exports = router
