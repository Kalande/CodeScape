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
    const {_id} = req.session.loggedInUser
    UserModel.findById(id)
    .populate('posts')
    .then((user) => {
        const {followers} = user
        if(followers.includes(_id)){
          req.app.locals.following = true;
        }
        else{
          req.app.locals.following = false;
        } 
        const {username, imageUrl} = req.session.loggedInUser
        res.render('main/userprofile', {user, username, imageUrl})
    })
    .catch((err) => {
        next(err) 
    })
})

router.post('/profile/:id', (req, res, next) => {
    const {id} = req.params
    const {_id, following} = req.session.loggedInUser
    following.push(id)
    UserModel.findByIdAndUpdate(id, {followers: [...followers,_id]}, {new: true})
    .then(() => {
        UserModel.findByIdAndUpdate(_id, {following: following}, {new: true})
        .then((user) => {
            req.session.loggedInUser = user
            res.redirect(`/profile/${id}`)
        })
        .catch(() => {
            
        })
   
    })
    .catch((err) => {
        next(err) 
    })
})

router.post('/profile/:id/unfollow', (req, res, next) => {
    const {id} = req.params
    const {_id, following} = req.session.loggedInUser
    let index = following.indexOf(id)
    following.splice(index,0)
    UserModel.findById(id)
    .then((user) => {
        const {followers} = user
        let i = followers.indexOf(_id)
        followers.splice(i,0)
        return UserModel.findByIdAndUpdate(id, {followers: followers}, {new: true}) 
    })
    .then(() => {
        return UserModel.findByIdAndUpdate(_id, {following: following}, {new: true})   
    })
    .then((user) => {
        req.session.loggedInUser = user
        res.redirect(`/profile/${id}`)
    })
    .catch((err) => {
        next(err) 
    })
})


module.exports = router;