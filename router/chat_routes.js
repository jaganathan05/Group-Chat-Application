const express = require('express');
const router = express.Router();
const chat_controller = require('../controller/chatcontroller');
const groupcontroller = require('../controller/groupcontroller');
const auth_middleware = require('../middleware/auth');

router.post('/sendmessage',auth_middleware.authentication,chat_controller.Post_Message);

router.get('/getmessage',auth_middleware.authentication,chat_controller.Get_Messages);




module.exports=router;