import { Course } from "../model/course.model.js";
import { CourseProgress } from "../model/courseProgress.js";

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        
        // Step 1 fetch the user course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");
        const courseDetails = await Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            return res.status(404).json({
                massege: "Coudn't Found the course"
            })
        }
        // If no progrss Found return course Details with empty Progress
  
        
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false,
                }
            })
        }
        // step-3 Return  The user's course progress along with course Details
        return res.status(200).json({
            data: {
                courseDetails,
                progress:courseProgress.lectureProgess,
                completed: courseProgress.completed,
            }
        })
    } catch (error) {
        console.log(error);
    }
};
export const updateLectureProgress=async(req,res)=>{
    try {
        const {courseId,lectureId}=req.params;
        const userId=req.id;
        
        // fetch or create courseProgress
        let courseProgress=await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            // If no progress exist, create a new record
            courseProgress= new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[]
            });
        }
        // find the lectureProgess in the course Progress
        const lectureIndex=courseProgress.lectureProgess.findIndex((lecture)=>lecture.lectureId===lectureId);

        if(lectureIndex !== -1){
            // if lecture alreday exixt, update its status
            courseProgress.lectureProgess[lectureIndex].viewed=true;
        }else{
            // add new lecture progress
            courseProgress.lectureProgess.push({
                lectureId,
                viewed:true
            })
        }

        // if all lecture is complete 
        const lectureProgressLength=courseProgress.lectureProgess.filter((lectureProg)=>lectureProg.viewed).length;

        const course=await Course.findById(courseId);
        
        if(course.lectures.length===lectureProgressLength){
            courseProgress.completed=true;
        }
        await courseProgress.save();

        return res.status(200).json({
            massege:"Lecture progress updated successfully"
        })
    } catch (error) {
        console.log(error); 
    }
};

export const markAsCompleted=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const userId=req.id;
        const courseProgress=await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            return res.status(404).json({
                massege:"Course Progress Not Found"
            })
        }

        courseProgress.lectureProgess.map((lectureProgess)=>lectureProgess.viewed=true);
        courseProgress.completed=true;
        await courseProgress.save();
        return res.status(200).json({
            massege:"Course marked as Completed"
        });
    } catch (error) {
        console.log(error);       
    }
};

export const markAsInCompleted=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const userId=req.id;
        
        const courseProgress=await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            return res.status(404).json({
                massege:"Course Progress Not Found"
            })
        }

        courseProgress.lectureProgess.map((lectureProgess)=>lectureProgess.viewed=false);
        courseProgress.completed=false;
        await courseProgress.save();
        return res.status(200).json({
            massege:"Course marked as InCompleted"
        });
    } catch (error) {
        console.log(error);       
    }
};