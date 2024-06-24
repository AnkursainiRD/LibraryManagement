import mongoose, { mongo } from "mongoose";

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    genre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Genre"
    },
    stock:{
        type:Number,
        required:true
    }
},{timestamps:true})

export const Book=mongoose.model("Book",bookSchema)