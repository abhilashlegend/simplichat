const express = require('express');

const user_route = express();

const bodyParser = require('body-parser');

user_route.use(bodyParser.json());

user_route.use(bodyParser.urlencoded({ extended: true}));

user_route.set('view engine', 'jade');
user_route.set('views', './views');

user_route.use(express.static('public'));

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename:function(req, file, cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const userController = require('../controllers/userController');

user_route.get('/', userController.homePage);

user_route.get('/register', userController.registerPage );
//user_route.post('/register', upload.single('image'), userController.register );

const upload = multer({ storage: storage });

module.exports = user_route;