const router = require('express').Router()
const UserModel = require('../models/User.model');
const loggedIn = require('../middlewares/authcheck');
const SnippetModel = require('../models/Snippet.model');

router.get('/find-friends', loggedIn, (req, res, next) => {
    const {user} = req.query

    if(user){
        UserModel.find({$text: {$search: user}})
        .then((users) => {
            const {username, imageUrl} = req.session.loggedInUser
            res.render('main/find-friends', {users, username, imageUrl})
        })
        .catch(() => {
            res.render('main/find-friends', {searcherr: 'Cannot find username'})
        })
        return;
    }

    UserModel.find().limit(100)
    .then((users) => {
        const {username, imageUrl} = req.session.loggedInUser
        res.render('main/find-friends', {users, username, imageUrl})
    })
    .catch((err) => {
        next(err)
    })
})

router.get('/profile/:id', loggedIn, (req, res, next) => {
    const {id} = req.params
    UserModel.findById(id)
    .populate('posts')
    .then((user) => {
        const {username, imageUrl} = req.session.loggedInUser
        res.render('main/userprofile', {user, username, imageUrl})
    })
    .catch((err) => {
        next(err) 
    })
})




module.exports = router;