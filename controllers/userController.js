const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerPage = async (req, res) => {
    try {
        res.render('register');
    }
    catch(error) {
        console.log(error.message);
    }
}

const register = async (req, res) => {

}

module.exports = {
    registerPage,
    register
}