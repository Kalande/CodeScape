const router = require("express").Router();
const UserModel = require('../models/User.model');
const axios = require('axios');

// Discover page routes
router.get('/discover', (req, res, next) => {
    const {_id} = req.session.loggedInUser
    UserModel.findById(_id)
    .then((user) => {
        axios.get(('https://gh-trending-api.herokuapp.com/repositories'))
        .then((response) => {
            res.render("main/discover", {user, response }) 
        })
    })
    .catch((err) => {
        console.log("Cannot get ai data")
        next(err)
    })
})

router.post('/discover', (req, res, next) => {
    let language = req.body.languages;
    const {_id} = req.session.loggedInUser
    console.log(language)

    axios.get(`https://gh-trending-api.herokuapp.com/repositories/${language}?since=daily&spoken_lang=en`)
    .then((response) => {
        UserModel.findById(_id)
        .then((user) => {

           res.render("main/discover", {user, response}) 
        })

    })
    .catch((err) => {
        console.log("could not get an api")
        next(err)
    })
})


module.exports = router;