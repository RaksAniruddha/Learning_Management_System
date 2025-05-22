import { User } from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js';
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                massege: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                massege: "User already exist with this email"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(200).json({
            success: true,
            massege: "Account created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            massege: "Failed to register"
        })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                massege: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                massege: "Invalid Username or Password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                massege: "Incorect Email Or password"
            })
        }
        generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Failed to login"
        })
    }
}
export const logout = async (_, res) => {
    try {
        res.status(200).cookie("token", "", { maxAge: 0 }).json({
            massege: "Logout Sucessfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Failed to Logout"
        })
    }
}
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password")
            .populate({
                path: "enrolledCourses",
                populate: {
                    path: "creator",
                    model: "User" 
                }
            });


        if (!user) {
            return res.status(404).json({
                massege: "Profile Not Found",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Faield to load user"
        })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;
        const user = await User.findById(userId);
        if (!user) {
            return req.status(404).json({
                massege: "User not found",
                success: false
            })
        }
        // extract public id of the old image  from the url is it exixts;
        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }
        //upload new phpto 
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = { name, photoUrl };
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        return res.status(200).json({
            status: true,
            user: updatedUser,
            massege: "Profile Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Faield to update profile"
        })
    }
}