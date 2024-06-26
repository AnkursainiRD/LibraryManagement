import { User } from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js"
import apiError from "../utils/apiErrorHandle.js"
import mongoose from "mongoose";

//utility function for creating the access token 
const createAccessToken=async(userId)=>{
    const user=await User.findById(userId)
    const newAccessToken=user.genereateAccessToken();
    user.accessToken=newAccessToken;
    await user.save({validateBeforeSave:false});
    return newAccessToken;
}


//functio for regester the user
const register=asyncHandler(async (req,res)=>{
    const {email,userName,password,role}=req.body

    if([email,userName,password,role].some((field)=>field?.trim()==="")){
        throw res.json( new apiError(400,"All fileds are required!"))
    }
    const existedUser=await User.findOne({$or:[{email},{userName}]})
    if(existedUser){
        throw res.json( new apiError(300,"User already exists!"))
    }

    const user=await User.create({
        email,
        password,
        userName:userName?.toLowerCase(),
        role
    }) 
    if(!user){
     throw res.json(new apiError(404,"Regestration Failed!"))
    }
    return res.status(200).json(
        new apiResponse(200,user,"User Regestered Successfuly")
    )  
})


//function for login user
const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw res.json(new apiError(303,"All Credentials Are Required!"))
    }

    const existedUser=await User.findOne({email})
    if(!existedUser){
        throw res.json(new apiError(404,"User Not Found!"))
    }

    if(!existedUser.isPasswordCorrect(password)){
        throw res.json(new apiError(401,"Invalid Credentials"))
    }

    const accessToken=await createAccessToken(existedUser?._id)
    const user=await User.findById(existedUser?._id).select("-password ")

    const optoins={
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,optoins).json(
        new apiResponse(200,{user,accessToken},"Login Successfuly")
    )
})


//function for logout user
const logout=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
    await User.findByIdAndUpdate(userId,{$unset:{accessToken:1}},{new:true})

    const optoins={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",optoins).json(
        new apiResponse(200,{},"Logout Successfuly")
    )
})


//function for my rented books
const myRentedBooks=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
    const myBooks=await User.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup:{
                from:"rentals",
                foreignField:"userId",
                localField:"_id",
                as:"myBooks",
                pipeline:[  
                    {
                        $lookup:{
                            from:"books",
                            foreignField:"_id",
                            localField:"bookId",
                            as:"bookDetails",
                            pipeline:[
                                {
                                    $project:{
                                        author:1,
                                        price:1,
                                        title:1,
                                        genre:1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])

    if(!myBooks){
        return res.status(200).json(
            new apiResponse(200,{},"No Books Found")
        )
    }
    return res.status(200).json(
        new apiResponse(200,myBooks,"Books Fetched")
    )
})


export {register,login,logout,myRentedBooks}