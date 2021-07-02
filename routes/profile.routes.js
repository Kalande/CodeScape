const router = require("express").Router();
const UserModel = require('../models/User.model');
const SnippetModel = require('../models/Snippet.model');

router.get('/home', (req,res, next) => {
    const {_id} = req.session.loggedInUser 
    UserModel.findById(_id)
    .populate('posts')
    .then((user) => {
        res.render('main/home', {user});
    })
    .catch(() => {
        
    })    
})

router.post('/home', (req, res, next) => {
    const {content} = req.body;
    SnippetModel.create({content})
    .then((post) => {

        const {_id, posts} = req.session.loggedInUser
        posts.push(post._id) 
        UserModel.findByIdAndUpdate(_id, {posts: posts}, {new:true})
        .then((user) => {
            req.session.loggedInUser = user
            res.redirect('/home')
        }) 
    })
    .catch(() => {
        console.log("Post is not created")
    })
})

router.get('/home/:id/delete', (req,res,next) => {
    let dynamicId = req.params.id;

    SnippetModel.findByIdAndDelete(dynamicId)
    .then(() => {
        res.redirect ('/home')
    })
    .catch(() => {
        next("Delete failed")
    })
})


router.get('/discover', (req,res,next) => {
    res.render("main/discover")
})

module.exports = router;