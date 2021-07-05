function checkLoggedIn(req,res,next){
    if(req.session.loggedInUser){
        next()
    }else{
        res.redirect('/')
    }
}

module.exports = checkLoggedIn