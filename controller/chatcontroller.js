const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Chats = require('../models/chats');

exports.Post_Message = async(req,res,next)=>{
    try{
        const user =req.user;
        const {message} = req.body;

        console.log(user.id,"  ", message)
        
        console.log(typeof(message))

        Chats.create({
            name: user.name,
            message: message,
            userId: user.id
        })
        .then(savemessage => {
            // handle success
            return res.status(200).json({ success: true, message: 'Message sent' });
        })
        .catch(err => {
            // handle error
            console.error(err);
            return res.status(400).json({ success: false, message: 'Failed to send', error: err.message });
        });
        
    }
    catch(err){
        return res.status(404).json({success:false,message:'Something Wrong'})
    }

}