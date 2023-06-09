const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');
const fs = require('fs');

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
            const passwordMatch = await bcrypt.compare(password, userData.password);

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
        var users = await User.find({_id: {$nin: [req.session.user._id]}});
        res.render('dashboard', { title: "Dashboard", user: req.session.user, users: users });
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

const saveChat = async (req, res) => {
    try {
        const chat = new Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message
        });

        const newChat = await chat.save();
        res.status(200).send({ success: true, msg: 'Chat saved!', data: newChat })
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
}

const updateProfile = async(req, res) => {
    try {
        let id = req.params.id;
        let new_image = '';
        let new_password = '';

        if(req.file){
            new_image =  'images/uploads/' + req.file.filename;
            try {
                fs.unlinkSync('./public/' + req.body.old_image);
            }
            catch(error){
                console.log(error);
            }
        } else {
            new_image = req.body.old_image;
        }

        if(req.body.password != ''){
            new_password = await bcrypt.hash(req.body.password, 10);
        } else {
            new_password = req.body.old_password;
        }

        User.findByIdAndUpdate(id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
            password: new_password
        }).then(async result => {
            const userData = await User.findOne({_id: id});
            req.session.user = userData;
            res.redirect("/dashboard")
        }).catch(error => {
            res.status(400).send({ success: false, msg: error.message })
        })
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
}

const deleteChat = async (req, res) => {
    try {
        await Chat.deleteOne({_id: req.body.id });
        res.status(200).send({ success: true, msg: 'Message deleted' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, msg: error });
    }
}

const profilePage = (req, res) => {
    try {
        res.render('profile', {title: 'Profile', user: req.session.user });    
        console.log(user);   
    } catch (error) {
        
    }
}

module.exports = {
    homePage,
    registerPage,
    register,
    loginPage,
    login,
    logout,
    dashboardPage,
    saveChat,
    deleteChat,
    profilePage,
    updateProfile
}