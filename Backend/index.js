import app from "./app.js";
import dbConnection from "./config/database.js";
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

dbConnection()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
    console.log("Server Started At :",process.env.PORT);
    })
})
.catch((error)=>{
    console.log("Mngodb connectino failed",error);
})