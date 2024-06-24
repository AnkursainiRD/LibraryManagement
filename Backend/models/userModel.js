import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","author","admin"],
        required:true
    },
    accessToken:{
        type:String
    }
},{timestamps:true})

//function for hasing password while register process
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
    next()
})

//function for check right password
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

//function for creating jwt token
userSchema.methods.genereateAccessToken=function(){
    return jwt.sign(
    {
        _id:this._id,
        role:this.role,
        userName:this.userName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

export const User=mongoose.model("User",userSchema)