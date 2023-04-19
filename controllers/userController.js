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

}

module.exports = {
    homePage,
    registerPage,
    register
}