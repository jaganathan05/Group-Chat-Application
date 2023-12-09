const express = require('express');
const router = express.Router();
const groupcontroller = require('../controller/groupcontroller');
const auth_middleware = require('../middleware/auth');


router.post('/creategroup', auth_middleware.authentication, groupcontroller.createGroup);
router.get('/getgroups', auth_middleware.authentication, groupcontroller.GetGroups);
router.get('/getgroupmembers',auth_middleware.authentication, groupcontroller.Get_Group_Members);
router.post('/addnewmember',auth_middleware.authentication,groupcontroller.AddnewMember);
router.post('/makegroupadmin',auth_middleware.authentication,groupcontroller.Makeadmin);
router.post('/removegroupmember',auth_middleware.authentication,groupcontroller.RemoveMember);
router.post('/removeadmin',auth_middleware.authentication,groupcontroller.RemoveAdmin);

router.post('/leavegroup',auth_middleware.authentication,groupcontroller.leavegroup);
router.post('/deletegroup',auth_middleware.authentication,groupcontroller.DeleteGroup);
module.exports = router;
