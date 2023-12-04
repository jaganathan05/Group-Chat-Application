const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.Get_Signup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public','views','signup.html'));
}

exports.Post_Signup =async (req, res, next) => {
    try{
    const { name, email, phoneno, password } = req.body;
    console.log(name, email, phoneno, password);
     const usercheck = await User.findOne({
        where:{
            email:email,phoneno:phoneno
        }
     });
     if(usercheck){
        return res.status(200).json({ success: true, message: 'User Already Have An Account' });
     }

   
    const result = await bcrypt.hash(password,10);
    const createUser = await User.create({
        name: name,
        email: email,
        password: result,
        phoneno:phoneno
    })
    
    if(createUser){
        return res.status(200).json({ success: true, message: 'Signup successful' })
    
    }
}
    catch{
        return res.status(500).json({ success: false, message: 'Signup failed' });
    }
}

exports.Get_Login =(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public','views','login.html'))
}

exports.Post_login = async (req,res,next)=>{
    try{
        const {email,password}= req.body;
        console.log(email,password);
        const user = await User.findOne({
            where:{
                email:email
            }
        })

        if(user){
            const checkpassword = await bcrypt.compare(password,user.password)

            if(checkpassword===true){
                return res.status(200).json({
                    success:true,
                    message:'login successfully',
                    token: generateToken(user.id)
                })
            }
            else {
                return res.status(401).json({success:false,message: 'User not authorized'});
            }
        }
        else {
            return res.status(404).json({success:false,message: 'User not found'});
        }
    }
    catch{
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

function generateToken(id){
    const SecretKey = process.env.SecretKey;
    console.log(SecretKey)
    return jwt.sign({userId : id },SecretKey)
}

exports.Get_ChatPage=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public','views','chats.html'));
}