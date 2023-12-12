const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Chats = require('../models/chats');
const sequelize = require('../helper/database');
const {Op} = require('sequelize');
const chats = require('../models/chats');

const socketIO = require('socket.io');
const io = socketIO(5000,{
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', (socket) => {

    
    console.log('A user connected with ID:', socket.id);
    console.log('login');
}); 




exports.Post_Message = async(req,res,next)=>{
    try{
        const user =req.user;
        const {message,groupId} = req.body;

         Chats.create({
            name: user.name,
            message: message,
            userId: user.id,
            groupId: groupId
        })
        .then(savemessage => {
            // handle success
            io.emit('receivemessage', { savemessage,groupId });
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

        

        const groupid = req.query.groupid
        const allchats = await Chats.findAll({
            where:{
                groupId: groupid
            },
            order:[['createdAt','ASC']],
        }
        
        );
        const userId = req.user.id;
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


