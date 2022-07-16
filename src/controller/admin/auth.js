const User =require('../../models/user');
const jwt = require("jsonwebtoken");

const shortid=require('shortid');
const {validationResult}=require('express-validator');
exports.signup=(req,res)=>{

    User.findOne({email:req.body.email})
.exec(async(error,user)=>{
    if(user)
    return res.status(400).json({
        message:'Admin already registered'
    });
    const {
        firstName,
        lastName,
        email,
        password
    }=req.body;
  
    const _user=new User({
        firstName,
        lastName,
        email,
        
        password,

        username:shortid.generate(),
        role:'admin'

    });
    _user.save((error,data)=>{
        if(error){
            return res.status(400).json({
                message:'something went wrong'
            });
        }
        if(data){
            return res.status(201).json({
                message:'Admin created successfully'
            })
        }
    });
});
}
exports.signin=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec(async(error,user)=>{
            if(error) return res.status(400).json({error});
            const ispassword=await user.authenticate(req.body.password);
            if(user)
            {
            if(ispassword&&user.role==='admin')
            {
                const token=jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'2d'});
                const {firstName,lastName,email,role,fullName}=user;
                res.status(200).json({
                    token,
                    user:{
                        firstName,lastName,email,role,fullName
                    }
                });
            }
            else{
                return res.status(400).json({
                    message:'Something went wrong'
                })
            }
        }
        else{
            return res.status(400).json({
                      message:'Something went wrong'
            });
        }
            
       
    });
}
exports.signout=(req,res)=>{
      res.clearCookie('token');
      res.status(200).json({
          message:'Signout successfully...!'
      })
}