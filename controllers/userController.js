const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const homePage = async (req, res) => {
    try {
        res.render('home',{title: "Home"});
    } catch(error){
        console.log(error);
    }
}

const registerPage = async (req, res) => {
    try {
        res.render('register',{title: "Register"});
    }
    catch(error) {
        console.log(error.message);
    }
}

const register = async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            image: 'uploads/' + req.file.filename,
            password: passwordHash
        });

        await user.save();

        res.render('register', {message: 'Registration completed successfully!'});

    } catch(error){
        console.log(error);
    }
}

module.exports = {
    homePage,
    registerPage,
    register
}