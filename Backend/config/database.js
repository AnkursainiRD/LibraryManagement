import mongoose from "mongoose"
import { db_name } from "../utils/roleConstent.js";

const dbConnection=async()=>{
    try {
        await mongoose.connect(`${process.env.DB_URL}/${db_name}`)
        console.log("Database Connected");
    } catch (error) {
        console.log("Database error :-",error);
        process.exit(1)
    }
}
export default dbConnection;