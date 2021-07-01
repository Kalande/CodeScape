const router = require('express').Router()
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs')

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

    const passcheck = /^(?=.*[0-9])(?=.*[!@#$%&])(?=.*[A-Z])(?=.{6,12})/
    if(!passcheck.test(password)){
        res.render('auth/signup', {error: `Password must have:
        - At least one Number
        - At least one Special character
        - At least one Uppercase letter
        - Must be between 6 and 12 characters`})
    }

    UserModel.create({username, email, password})
    .then(() => {
        res.redirect('/')
    })
    .catch((err) => {
        next(error)
    })   
})

module.exports = router