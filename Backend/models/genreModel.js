import mongoose from "mongoose";

const genreSchema=new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    }
},{timestamps:true})

export const Genre=mongoose.model("Genre",genreSchema)