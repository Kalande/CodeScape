const router = require("express").Router();
const UserModel = require('../models/User.model');
const SnippetModel = require('../models/Snippet.model');
const axios = require('axios');

router.get('/home', (req, res, next) => {
    const {search} = req.query

    if (!search) {
        const {_id} = req.session.loggedInUser
        UserModel.findById(_id)
            .populate('posts')
            .then((user) => {
                res.render('main/home', {user});
            })
            .catch((err) => {
                next(err)
            })
    } else {
        const {_id} = req.session.loggedInUser
        SnippetModel.find({$and: [{$text: {$search: search}}, {owner: _id}]})
            .then((posts) => {
                res.render('main/home', {posts})
            })
            .catch(() => {
                res.render('main/home', {searcherr: "Cannot find what you're looking for"})
            })
    }

})

router.post('/home', (req, res, next) => {
    const {title,content} = req.body;
    if (!title) {
        res.render('main/home', {error: 'Title is required'})
        return;
    }

    const {_id,posts} = req.session.loggedInUser

    SnippetModel.create({title,content,owner: _id,})
        .then((post) => { 
            posts.push(post._id)
            UserModel.findByIdAndUpdate(_id, {posts: posts}, {new: true })
                .then((user) => {
                    req.session.loggedInUser = user
                    res.redirect('/home')
                })
        })
        .catch(() => {
            next("Post is not created")
        })
})

router.get('/home/:id/delete', (req, res, next) => {
    let dynamicId = req.params.id;

    SnippetModel.findByIdAndDelete(dynamicId)
        .then(() => {
            res.redirect('/home')
        })
        .catch(() => {
            next("Delete failed")
        })
})

//Edit routes to go here


router.get('/discover', (req, res, next) => {
    const {_id} = req.session.loggedInUser
    UserModel.findById(_id)
    .then((user) => {
       res.render("main/discover", {user}) 
    })
    .catch((err) => {
        next(err)
    })


    axios.get('https://ghapi.huchen.dev/languages')
    .then((response) => {
        console.log(response)
    })
    .catch(() => {
        console.log("could not get api")
    })
})

module.exports = router;