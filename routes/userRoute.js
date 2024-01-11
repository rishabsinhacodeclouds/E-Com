const express = require('express');
const user_route = express();

const userController = require('../controllers/userController');

user_route.post('/register',userController.verifyRegister);
user_route.post('/login',userController.verifyLogin);


module.exports = user_route;