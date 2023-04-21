const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const homePage = async (req, res) => {
    try {
        res.render('home',{title: "Home"});
    } catch(error){
        console.log(error);
    }
}

const loginPage = async (req, res) => {
    try {
        res.render('login', {title: "Login"});
    } catch(error){
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email: email});
        if(userData){
            const passwordMatch = bcrypt.compare(password, userData.password);

            if(passwordMatch){
                req.session.user = userData;
                res.redirect('/dashboard');
            } else {
                res.render('login', {message: 'Email or Password is incorrect!'});
            }
        } else {
            res.render('login', {message: 'Email or Password is incorrect!'})
        }
    } catch(error) {
        console.log(error);
    }
}

const logout = async(req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch(error) {
        console.log(error);
    }
}

const dashboardPage = async(req, res) => {
    try {
        res.render('dashboard', { title: "Dashboard", user: req.session.user });
    } catch(error) {
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
            image: 'images/uploads/' + req.file.filename,
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
    register,
    loginPage,
    login,
    logout,
    dashboardPage
}