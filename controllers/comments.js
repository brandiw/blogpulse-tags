var express = require('express')
var db = require('../models')
var router = express.Router()

router.post('/', (req, res) => {
    db.comment.create(req.body)
    .then( com => {
        res.redirect('/articles/' + req.params.id )
    })
    .catch(function(error) {
        console.log(error)
        res.status(400).render('main/404')
    })
})

module.exports = router
