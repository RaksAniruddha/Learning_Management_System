import express from 'express';
import upload from '../utils/multer.js';
import { uploadMedia } from '../utils/cloudinary.js';

const router=express.Router();

router.route("/upload-video").post(upload.single("file"),async(req,res)=>{
    try {
        const  result=await uploadMedia(req.file.path);
        res.status(200).json({
            success:true,
            massege:"File uploaded successfully",
            data:result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            massege:"Error Uploading file"
        })
    }
});
export default router;
