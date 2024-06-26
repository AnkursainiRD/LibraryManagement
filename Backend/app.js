import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json({limit:'20kb'}))
app.use(cookieParser())

//user route imports
import userRoute from "./routes/userRoutes.js"

//mount user routes
app.use("/api/v1/users",userRoute)

export default app;