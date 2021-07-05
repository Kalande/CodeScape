const router = require('express').Router()
const UserModel = require('../models/User.model');
const SnippetModel = require('../models/Snippet.model');

router.get('/find-friends', (req, res, next) => {
    const {search} = req.query

    if(search){
        UserModel.find({$text: {$search: search}}).limit(100)
        .then((users) => {
            res.render('main/find-friends', {users})
        })
        .catch((err) => {
            next(err)
        })
        return;
    }

    UserModel.find().limit(100)
    .then((users) => {
        res.render('main/find-friends', {users})
    })
    .catch((err) => {
        next(err)
    })
})




module.exports = router;