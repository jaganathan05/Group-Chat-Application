const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Chats = require('../models/chats');
const sequelize = require('../helper/database');
const {Op} = require('sequelize');
const chats = require('../models/chats');

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

exports.Get_Messages = async (req,res,next)=>{
    try{
        const count = await Chats.count();

        const allchats = await Chats.findAll({
            order:[['createdAt','ASC']],
            limit: 10,
            offset: count - 10
        }
        
        );
        const userId = req.user.id;
        console.log(userId)
        return res.status(200).json({
            success:true,
            message: allchats,
            userId:userId
        })
    }
    catch(err){
        console.log('GET Messages err',err)
    }
    

}
exports.Get_New_Messages=async(req,res,next)=>{
    try{
    const params = req.query.lastmessageid ;
    console.log(params)

    const response = await Chats.findAll({
        where:{
            id:{ [Op.gt]: params}
        }
        
    })

    const userId = req.user.id;
    console.log(userId)
    return res.status(200).json({
        success:true,
        message: response,
        userId:userId
    })
}

    catch(err){
        console.log('GET New Message Error', err)
    }
    
}
