import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js"
import apiError from "../utils/apiErrorHandle.js"
import mongoose from "mongoose";


//function for publish the book
const publishBook=asyncHandler(async(req,res)=>{
    const {title,price,genre,stock}=req.body
    if(!title||!price ||!genre ||!stock){
        throw res.json(new apiError(302,"All Fields Are Required!"))
    }
    const author=req.user?._id;
    const existedBook=await Book.findOne({title,author,genre})

    if(existedBook){
        throw res.json(new apiError(400,"Book Already Exists"))
    }

    const book=await Book.create({title,author,price,genre,stock})

    if(!book){
        throw res.json(new apiError(303,"Book Publish Process Failed"))
    }
    return res.status(200).json(
        new apiResponse(200,book,"Book Published Successfuly")
    )
})


//update the book
const updateBook=asyncHandler(async(req,res)=>{
    const {bookId}=req.params
    const {title,stock,price,genre}=req.body
    if(!bookId){
        throw new apiError(404,"Book Not Found!")
    }

    if(!title || !stock || !price ||!genre){
        throw res.json(new apiError(404,"All Fileds Are Required"))
    }
    const updatedBook=await Book.findByIdAndUpdate(bookId,{title,stock,price,genre},{new:true})
    if(!updatedBook){
        throw res.json(new apiError(401,"Update Process Failed"))
    }
    return res.status(200).json(
        new apiResponse(200,updatedBook,"Book Updated")
    )
})


//delete the book
const deleteBook=asyncHandler(async(req,res)=>{
    const {bookId}=req.params
    if(!bookId){
        throw res.json(new apiError(404,"Book Not Exists"))
    }
    await Book.findByIdAndDelete(bookId)
    return res.status(200).json(
        new apiResponse(200,{},"Book Deleted Successfuly")
    )
})


//get all the books
const getAllBooks=asyncHandler(async(req,res)=>{
    const allBooks=await Book.find({})
    if(!allBooks){
        throw res.json(new apiError(404,"No Books Found"))
    }
    return res.status(200).json(
        new apiResponse(200,allBooks,"All Books Fetched")
    )
})


//get author published book
const getMyBooks=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
    if(!userId){
        throw res.json(new apiError(404,"Something Went Wrong"))
    }
    const userBooks=await User.aggregate([
        {
            $match:{_id: mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup:{
                from:"books",
                foreignField:"author",
                localField:"_id",
                as: "authorBooks"
            }
        },
        {
            $addFields:{
                authorBooks:{$first:"$authorBooks"}
            }
        },
        {
            $project:{
                userName:1,
                email:1,
                authorBooks:1
            }
        }
    ])

  if(!userBooks){
    throw res.json(new apiError(404,"Data Not Found"))
  } 
  return res.status(200).json(
    new apiResponse(200,userBooks,"Data Fetched Succesfuly")
  )
})



export {publishBook,updateBook,deleteBook,getMyBooks,getAllBooks}