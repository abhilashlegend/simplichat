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

// Serve the Bootstrap Icons CSS file
user_route.use('/css/bootstrap-icons.css', express.static('node_modules/bootstrap-icons/font/bootstrap-icons.css'));

// Serve the Bootstrap Icons SVG sprite file
user_route.use('/icons/bootstrap-icons.svg', express.static('node_modules/bootstrap-icons/font/bootstrap-icons.svg'));

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
const auth = require('../middlewares/auth');
const upload = multer({ storage: storage });

user_route.get('/', auth.isLogout, userController.homePage);

user_route.get('/register', auth.isLogout,  userController.registerPage );
user_route.post('/register', upload.single('image'), userController.register );
user_route.get('/login', auth.isLogout, userController.loginPage);
user_route.post('/login', userController.login);
user_route.get('/logout', auth.isLogin, userController.logout);
user_route.get('/dashboard', auth.isLogin, userController.dashboardPage);
user_route.get('/profile', auth.isLogin, userController.profilePage);
user_route.post('/update-profile/:id', upload.single('image'), userController.updateProfile);
user_route.post('/save-chat', userController.saveChat);
user_route.post('/delete-chat', userController.deleteChat);
user_route.get('*', (req, res) => res.redirect('/'));

module.exports = user_route;