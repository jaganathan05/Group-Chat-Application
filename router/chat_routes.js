const express = require('express');
const router = express.Router();
const chat_controller = require('../controller/chatcontroller');
const auth_middleware = require('../middleware/auth');

router.post('/sendmessage',auth_middleware.authentication,chat_controller.Post_Message);

module.exports=router;