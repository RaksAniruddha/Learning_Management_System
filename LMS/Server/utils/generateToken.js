import jwt from 'jsonwebtoken';

export const generateToken=(res,user,massege)=>{
    const token =jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"})
    res.status(200).cookie("token",token,{
        httpOnly:true,
        sameSite:"None",
        secure:true,
        maxAge:24*60*60*1000
    }).json({
        success:true,
        massege,
        user,
    })
}