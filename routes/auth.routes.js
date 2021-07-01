const router = require("express").Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs')

router.get('/login', (req,res, next) => {
    res.render('auth/login');
});

router.post('/login', (req,res, next) => {
    const {username, password} = req.body
    console.log(username, password)

    UserModel.findOne({username})
        .then((user) => {
            console.log(user)
            if(user){ 
                const {password: hashfromDB} = user
                let isValid = bcrypt.compareSync(password, hashfromDB)
                if (isValid) {

                    req.session.loggedInUser = user;
                    req.app.locals.isLoggedIn = true;
                    res.redirect('/main');

                }
                else{
                    res.render('auth/login', {error: 'Password Invalid'})
                }
            }else{
                res.render('auth/login', {error: 'Username does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })  
});


module.exports = router;
  



































module.exports = router;