const express = require('express');

const user_route = express();

const bodyParser = require('body-parser');
const session = require('express-session');
const { SESSION_SECRET } = process.env;
user_route.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

user_route.use(bodyParser.json());

user_route.use(bodyParser.urlencoded({ extended: true}));

user_route.set('view engine', 'jade');
user_route.set('views', './views');

user_route.use(express.static('public'));

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images/uploads'));
    },
    filename:function(req, file, cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const userController = require('../controllers/userController');
const upload = multer({ storage: storage });

user_route.get('/', userController.homePage);

user_route.get('/register', userController.registerPage );
user_route.post('/register', upload.single('image'), userController.register );
user_route.get('/login', userController.loginPage);
user_route.post('/login', userController.login);
user_route.get('/logout', userController.logout);
user_route.get('/dashboard', userController.dashboardPage);
user_route.get('*', (req, res) => res.redirect('/'));

module.exports = user_route;