import mongoose from "mongoose";

const rentalSchema=new mongoose.Schema({
   bookId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Book",
    required:true
   },
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   quantity:{
    type:Number,
    required:true
   }
},{timestamps:true})

export const Rental=mongoose.model("Rental",rentalSchema)