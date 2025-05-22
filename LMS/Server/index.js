import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import {connectDb} from '../Server/database/db.js';
import userRoute from './route/user.route.js';
import courseRoute from './route/course.route.js';
import mediaRoute from './route/media.route.js';
import purchaseRoute from './route/puchaseCourse.route.js';
import courseProgressRoute from './route/courseProgress.route.js'

dotenv.config({});
connectDb();

const app=express();

const PORT=process.env.PORT||3000

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
// apis
app.use("/api/v1/media",mediaRoute)
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/purchase",purchaseRoute);
app.use("/api/v1/progress",courseProgressRoute);

app.listen(PORT,()=>{
    console.log(`server listen at port ${PORT}`);   
})