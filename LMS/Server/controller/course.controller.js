import { Course } from "../model/course.model.js";
import { Lecture } from "../model/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from '../utils/cloudinary.js'

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                massege: "Course Title And Category are Required",
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })

        return res.status(200).json({
            course,
            massege: "Course Created"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Failed to Create Course",
        })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                massege: "Course not Found"
            })
        }
        return res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Failed to create course",
        })
    }
};

export const searchCourse= async(req,res)=>{
    try {
        const {query="",categories=[],sortByPrice=""}=req.query;
        
        // create Scearch Query
        const searchCriteria={
            isPublished:true,
            $or:[
                {courseTitle:{$regex:query,$options:'i'}},
                {subTitle:{$regex:query,$options:'i'}},
                {category:{$regex:query,$options:'i'}}
            ]
        }
        // if category selected
        if(categories.length>0){
            searchCriteria.category={$in:categories};
        }
        // define sorting order

        const sortOptions={};
        if(sortByPrice==='low'){
            sortOptions.coursePrice=1;
        }else if(sortByPrice==="high"){
            sortOptions.coursePrice=-1;
        }
        
        let courses= await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions);
        
        return res.status(200).json({
            success:true,
            courses:courses||[]
        });


    } catch (error) {
        console.log(error);
           
    }
}
export const getPublishedCourse=async(_,res)=>{
    try {
        const courses=await Course.find({isPublished:true}).populate({path:"creator",select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                massege:"Course Not Found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "Failed to get published course",
        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description,
            category, coursePrice, courseLevel } = req.body;
        const thumbnail = req.file;
        

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                massege: "course not found"
            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }
        const updatedData = {
            courseTitle, subTitle, description,
            category, coursePrice, courseLevel, courseThumbnail: courseThumbnail?.secure_url
        }
        course = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });
        return res.status(200).json({
            course,
            massage: "Course Updated Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "failed to edit course",
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                massage: "Course not found"
            })
        }
        return res.status(200).json({
            course,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "failed to get course",
        })
    }
}

// letcure api logic start
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle && !courseId) {
            return res.status(400).json({
                massege: "lecture Title is required"
            })
        }
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        res.status(201).json({
            lecture,
            massege: "Lecture Created Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "failed to add lecture",
        })
    }
}
export const getCourseLecture = async (req, res) => {
    try {
        const courseId= req.params.courseId;
        const course= await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                massege:"course not found",
                success:false
            })
        }
        return res.status(200).json({
            lectures:course.lectures
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "failed to get lecture",
        })
    }
};
export const editLecture=async(req,res)=>{
    try {
        const {lectureTitle,videoInfo,isPreviewFree}=req.body;
        const {courseId,lectureId}=req.params;
        const lecture= await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                massege:"Lecture not found"
            })  
        }
        // update lectureTitle
        if(lectureTitle)lecture.lectureTitle=lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl=videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId=videoInfo.publicId;
        lecture.isPreviewFree=isPreviewFree;

        await lecture.save();

        //Ensure that the Course still has lectureId if it was not allready exists
        const course=await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            massege:"Lecture Updated Succesfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            massege: "failed to edit lecture",
        })
    }
};
export const removeLecture=async(req,res)=>{
    try {
        const {lectureId}=req.params;
        const lecture=await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                massege:"lecture not found"
            });
        }
        // delete the lecture from clodinary also
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId)
        }
        // remove the lecture reference from the associated course
        
        await Course.updateOne(
            {lectures:lectureId},  //find the course contain lecture
            {$pull:{lectures:lectureId}} //Remove the lecture id from lectures array
        );

        return res.status(200).json({
            massege:"Lecture Removed Succesfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            massege:"Failed to remove lecture"
        })
    }
};

export const getLectureById=async(req,res)=>{
        try {
            const {lectureId}=req.params;
            const lecture= await Lecture.findById(lectureId);
            if(!lecture){
                return res.status(404).json({
                    massege:"Lecture Not found"
                })
            }
            return res.status(200).json({
                lecture,
            }); 
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                massege:"Failed to get lecture by Id"
            })            
        }
};

// publish unpublish course logic
export const togglePublishCourse=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const {publish}=req.query; //true false
        
        const course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                massege:"Course Not Found"
            })
        }
        // publish status based on query parameter
        course.isPublished= publish === "true"
        await course.save();

        const statusMessage=course.isPublished?"Published":"Unpublished"
        return res.status(200).json({
            massege:`Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            massege:"Failed to update status"
        })  
    }
}

