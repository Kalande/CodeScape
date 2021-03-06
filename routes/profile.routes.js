const router = require("express").Router();
const UserModel = require('../models/User.model');
const SnippetModel = require('../models/Snippet.model');
const uploader = require('../config/cloudinary.config.js');
const loggedIn = require('../middlewares/authcheck')
const bcrypt = require('bcryptjs')

router.get('/home', loggedIn, (req, res, next) => {
    const {search} = req.query
    const {_id, username, imageUrl} = req.session.loggedInUser
    if (!search) {
        
        UserModel.findById(_id)
            .populate('posts')
            .then((user) => {
                res.render('main/home', {user, username, imageUrl});
            })
            .catch((err) => {
                next(err)
            })
    } else {
        const {_id} = req.session.loggedInUser
        SnippetModel.find({$and: [{$text: {$search: search}}, {owner: _id}]})
            .then((posts) => {
                res.render('main/home', {posts, username, imageUrl})
            })
            .catch(() => {
                res.render('main/home', {searcherr: "Cannot find what you're looking for"})
            })
    }

})

router.post('/home', (req, res, next) => {
    const {title,content,programlang} = req.body;
    const {_id,posts} = req.session.loggedInUser

    if (!title) {
        UserModel.findById(_id)
        .populate('posts')
        .then((user) => {
           const {posts} = user
           res.render('main/home', {posts, error: 'Title is required'}) 
        })
        .catch((err) => {
            next(err)
        })
        return;    
    }

    SnippetModel.create({title,content,programlang,owner: _id})
        .then((post) => { 
            posts.push(post._id)
            UserModel.findByIdAndUpdate(_id, {posts: posts}, {new: true })
                .then((user) => {
                    req.session.loggedInUser = user
                    res.redirect('/home')
                })
        })
        .catch((err) => {
            console.log(err)
            next("Post is not created")
        })
})

router.post('/upload', uploader.single("imageUrl"), (req, res, next) => {
    const {path} = req.file
    
    const {_id} = req.session.loggedInUser
   if (!req.file) {
     next(new Error('No file uploaded!'));
     return;
   }
   UserModel.findByIdAndUpdate(_id, {imageUrl: path}, {new: true})
   .then((user) => {
       req.session.loggedInUser = user
       res.redirect('/myprofile')
    })
    .catch((err) => {
       next(err)
    })
    
})

router.get('/home/:id/delete', (req, res, next) => {
    let dynamicId = req.params.id;
    const {_id, posts} = req.session.loggedInUser
    SnippetModel.findByIdAndDelete(dynamicId)
        .then(() => {
            let index = posts.indexOf(dynamicId)
            posts.splice(index,1)
            UserModel.findByIdAndUpdate(_id, {posts: posts}, {new: true})
            .then((user) => {
                req.session.loggedInUser = user
                res.redirect('/home')
            })
            .catch(() => {
                
            })
            
            
        })
        .catch(() => {
            next("Delete failed")
        })
})

//Edit routes to go here
router.get('/home/:id/edit', (req,res,next) => {
    const {id} = req.params
    const {_id} = req.session.loggedInUser
    UserModel.findById(_id)
        .populate('posts')
        .then((user) => {
            SnippetModel.findById(id)
            .then((post) => {
            res.render('main/edit-snippet', {user, post})
            })
            .catch((err) => {
                next(err)
            })
        })
        .catch((err) => {
            next(err)
        })
})

router.post('/home/:id/edit', (req, res, next) => {
    const {id} = req.params
    const {title, content} = req.body
    if(!title){
        res.render('main/edit-snippet', {error: "Title is required"})
        return;
    }
    SnippetModel.findByIdAndUpdate(id, {title, content}, {new: true})
    .then(() => {
        res.redirect('/home')
    })
    .catch((err) => {
        next(err)
    })  
})

// My profile routes

router.get('/myprofile', loggedIn, (req, res, next) => {
    const {_id} = req.session.loggedInUser
    UserModel.findById(_id)
    .populate('following')
    .populate('followers')
    .then((user) => {
        res.render('main/myprofile', {user})
    })
    .catch((err) => {
        next(err)
    })
})

router.post('/myprofile', (req, res, next) => {
    const {username, email, password, about} = req.body
    const {_id} = req.session.loggedInUser

    if(!password){
        UserModel.findByIdAndUpdate(_id, {username, email, about}, {new: true})
        .then(() => {
            res.redirect('/myprofile')
        })
        .catch(() => {
            res.render('main/myprofile' , {error: 'Username already taken'})
        })
        return;
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let passcheck = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,14}$/
    if(!passcheck.test(password)){
        res.render('main/myprofile', {error: `Password must have:
        - At least one Number
        - At least one Special characters
        - Must be between 6 and 14 characters`})
        return;
    }

    UserModel.findByIdAndUpdate(_id, {username, email, password: hash, about}, {new: true})
    .then((user) => {
        req.session.loggedInUser = user
        res.redirect('/myprofile')
    })
    .catch(() => {
        res.render('main/myprofile' , {error: 'Username already taken'})
    }) 
})

router.get('/saved', loggedIn, (req, res,next) => {
    const {_id} = req.session.loggedInUser
    UserModel.findById(_id)
    .populate({path: 'savedsnippets', populate: {path: 'owner'}})
    .then((user) => {
        res.render('main/savedsnippets', {user})
    })
    .catch((err) => {
        next(err)
    })
    
})

router.get('/saved/:id/delete', (req,res,next) => {
    const {_id} = req.session.loggedInUser
    const {id} = req.params
    UserModel.findById(_id)
    .then((user) => {
        const {savedsnippets} = user
        let save = savedsnippets.indexOf(id) 
        savedsnippets.splice(save, 1)
        return UserModel.findByIdAndUpdate(_id, {savedsnippets: savedsnippets}, {new: true})
    })
    .then((user) => {
        req.session.loggedInUser = user
        res.redirect('/saved')
    })
    .catch((err) => {
        next(err)
    }) 
})

module.exports = router;