import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
import asyncHandler from '../utils/asyncHandler.js'
import apiError from '../utils/apiErrorHandle.js'
import { roles } from '../utils/roleConstent.js'


//check the authentication 
const verifyJwt=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
        throw res.json(new apiError(401,"Unauthorize Request"))
    }
    const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodeToken?._id).select("-password")
    if(!user){
        throw res.json(new apiError(404,"User Not Exists"))
    }
    req.user=user
    next()
})

//check the author authorization
const isAuthor=async(req,res,next)=>{
    console.log(req.user.role===roles[1]);
    if(req.user?.role!==roles[1]){
        return res.status(401).json(
            new apiError(401,"Unauthorized Access")
        )
    }
    next()
}

//check the admin authorization
const isAdmin=async(req,res,next)=>{
    if(!req.user?.role===roles[2]){
        return res.status(401).json(
            new apiError(401,"Unauthorized Access")
        )
    }
    next()
}


export {verifyJwt,isAuthor,isAdmin}