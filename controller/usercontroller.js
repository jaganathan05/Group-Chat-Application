const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/users');
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