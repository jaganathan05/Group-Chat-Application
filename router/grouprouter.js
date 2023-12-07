const express = require('express');
const router = express.Router();
const groupcontroller = require('../controller/groupcontroller');
const auth_middleware = require('../middleware/auth');



router.post('/creategroup',auth_middleware.authentication,groupcontroller.createGroup);

router.get('/getgroups',auth_middleware.authentication,groupcontroller.GetGroups);

module.exports=router;