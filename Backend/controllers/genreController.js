import { Genre } from "../models/genreModel.js";
import apiError from "../utils/apiErrorHandle.js";
import apiResponce from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//function for create new genre
const createGenre=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    if(!name || !description){
        throw res.json(new apiError(302,"All Fileds Are Required"))
    }
    const existedGenere=await Genre.find({$or:[{name:name},{description:description}]})
    if(existedGenere){
        throw res.json(new apiError(400,"Genre Already Exists"))
    }
    const newGenere=await Genre.create({name,description})
    if(!newGenere){
        throw res.json(new apiError(404,"Failed To Create Genre"))
    }
    return res.status(200).json(
        new apiResponce(200,newGenere,"Genre Created Successfuly")
    )
})


//function for delete genre
const deleteGenre=asyncHandler(async(req,res)=>{
    const {genreId}=req.params
    if(!genreId){
        throw res.json(new apiError(404,"Genre Not Found"))
    }
    await Genre.findByIdAndDelete(genreId)
    return res.status(200).json(
        new apiResponce(200,{},"Genre Deleted")
    )
})

//function for get a book by genre
const getBookByGenre=asyncHandler(async(req,res)=>{
    const {genre}=req.params
    const genreBooks=await Genre.aggregate([
        {
            $match:{title:genre?.toLowerCase()}
        },
        {
            $lookup:{
                from:"books",
                foreignField:"genre",
                localField:"_id",
                as:"genreBooks"
            }
        }
    ])
    if(!genreBooks){
        return res.status(200).json(
            new apiResponce(200,{},"No Books Found")
        )
    }
    return res.status(200).json(
        new apiResponce(200,genreBooks,"Book Fetched")
    )
})

export {createGenre,getBookByGenre,deleteGenre}