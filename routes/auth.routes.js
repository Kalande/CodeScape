const router = require("express").Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs')

router.get('/login', (req,res, next) => {
    res.render('auth/login');
});

router.post('/login', (req,res, next) => {
    const {username, password} = req.body

    UserModel.findOne({username})
        .then((user) => {
            if(user){ 
                const {password: hashfromDB} = user
                let isValid = bcrypt.compareSync(password, hashfromDB)
                if (isValid) {

                    req.session.loggedInUser = user;
                    req.app.locals.isLoggedIn = true;
                    res.redirect('/home');

                }
                else{
                    res.render('auth/login', {error: 'Invalid Password'})
                }
            }else{
                res.render('auth/login', {error: 'Username does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })  
});

router.get('/signup', (req,res,next) => {
    res.render('auth/signup')
})

router.post('/signup', (req,res,next) => {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        res.render('auth/signup', {error: 'Please fill out all fields'})
        return;
    }
    
    const emailreg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailreg.test(email)){
        res.render('auth/signup', {error: 'Email not in valid format'})
        return;
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let passcheck = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,14}$/
    if(!passcheck.test(password)){
        res.render('auth/signup', {error: `Password must have:
        - At least one Number
        - At least one Special characters
        - Must be between 6 and 14 characters`})
        return;
    }

    UserModel.create({username, email, password: hash})
    .then(() => {
        res.redirect('/')
    })
    .catch(() => {
        res.render('auth/signup' , {error: 'Username already taken'})
    })   
})


module.exports = router;