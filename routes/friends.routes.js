const router = require('express').Router()
const UserModel = require('../models/User.model');
const loggedIn = require('../middlewares/authcheck');
const SnippetModel = require('../models/Snippet.model');


router.get('/find-friends', loggedIn, (req, res, next) => {
    const {user} = req.query
    const {username} = req.session.loggedInUser
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
    
    UserModel.find({$nor: [{username: username}]}).limit(100)
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
    UserModel.findById(id)
    .then((user) => {
        const {followers} = user
        return UserModel.findByIdAndUpdate(id, {followers: [...followers,_id]}, {new: true})
    })
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
    let unfollow = following.splice(index,0)
    UserModel.findById(id)
    .then((user) => {
        const {followers} = user
        let i = followers.indexOf(_id)
        let arrfollowers = followers.splice(i,0)
        return UserModel.findByIdAndUpdate(id, {followers: arrfollowers}, {new: true}) 
    })
    .then(() => {
        return UserModel.findByIdAndUpdate(_id, {following: unfollow}, {new: true})   
    })
    .then((user) => {
        req.session.loggedInUser = user
        res.redirect(`/profile/${id}`)
    })
    .catch((err) => {
        next(err) 
    })
})

router.post('/profile/:postId/like', (req, res, next) => {
    const {postId} = req.params
    const {_id} = req.session.loggedInUser
    SnippetModel.findById(postId)
    .then((post) => {
        const {likes} = post
        if(!likes.includes(_id)){
         likes.push(_id)
         return SnippetModel.findByIdAndUpdate(postId, {likes: likes})   
        }
        else{
            let i = likes.indexOf(_id)
            let splice = likes.splice(i,0)
         return SnippetModel.findByIdAndUpdate(postId, {likes: splice})
        } 
    })
    .then((post) => {
       const {owner} = post
       res.redirect(`/profile/${owner}`)
    })
    .catch((err) => {
        next(err)
    })
    
})

router.post('/profile/:postId/dislike', (req, res, next) => {
    const {postId} = req.params
    const {_id} = req.session.loggedInUser
    SnippetModel.findById(postId)
    .then((post) => {
        const {dislikes} = post
        if(!dislikes.includes(_id)){
            req.app.locals.dislike = true;
            dislikes.push(_id)
            return SnippetModel.findByIdAndUpdate(postId, {dislikes: dislikes})   
           }
           else{
            req.app.locals.dislike = false;
            let i = dislikes.indexOf(_id)
            let splice = dislikes.splice(i,0)
            return SnippetModel.findByIdAndUpdate(postId, {dislikes: splice})
           } 
    })
    .then((post) => {
       const {owner} = post
       res.redirect(`/profile/${owner}`)
    })
    .catch((err) => {
        next(err)
    })  
})

router.post('/profile/:postId/save', (req, res, next) => {
    const {postId} = req.params
    const {_id, savedsnippets} = req.session.loggedInUser
    savedsnippets.push(postId)
   UserModel.findByIdAndUpdate(_id, {savedsnippets: savedsnippets}, {new: true})
    .then((user) => {
        console.log(user.savedsnippets)
        req.session.loggedInUser = user
        return SnippetModel.findById(postId)
    })        
    .then((post) => {
    const {owner} = post
    res.redirect(`/profile/${owner}`)
    })
    .catch((err) => {
        next(err)
    })  
})
module.exports = router;