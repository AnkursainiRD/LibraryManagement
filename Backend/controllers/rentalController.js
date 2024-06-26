import { Rental } from "../models/rentalSchema.js";
import apiError from "../utils/apiErrorHandle.js";
import apiResponce from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


//rent a book
const rentTheBook=asyncHandler(async(req,res)=>{
    const {quantity}=req.body
    const bookId=req.params.id
    const userId=req.user?._id
    if(!bookId ){
        throw res.json(new apiError(403,"Invalid Book Id"))
    }
    const rentedBook=await Rental.create({bookId,userId,quantity})
    if(!rentedBook){
        throw res.json(new apiError(400,"Failed To Rent"))
    }
    return res.status(200).json(
        new apiResponce(200,rentedBook,"Book Rented Successfuly")
    )
})

//get the all books rent details
const getRentDetails=asyncHandler(async(req,res)=>{
    const rentDetails=await Rental.find({}).populate({path:"bookId", populate:{path:"author",select:["-role","-password","-accessToken","-createdAt","-updatedAt"]},select:"-stock"})
                                           .populate({path:"userId",select:["-password","-accessToken","-createdAt","-updatedAt"]})
                                           .exec()
    if(!rentDetails){
        throw res.json(new apiError(404,"No Data Found"))
    }
    return res.status(200).json(
        new apiResponce(200,rentDetails,"Data Fetched")
    )
})

export {rentTheBook,getRentDetails}