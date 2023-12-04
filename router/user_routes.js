const express = require('express');
const router = express.Router();
const user_controller = require('../controller/usercontroller');

router.get('/signup',user_controller.Get_Signup);

router.post('/signup',user_controller.Post_Signup);

router.get('/login',user_controller.Get_Login);

router.post('/login',user_controller.Post_login);

module.exports=router;