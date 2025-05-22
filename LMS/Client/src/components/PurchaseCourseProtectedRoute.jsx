import { useGetCourseDetailsWithStatusQuery } from "@/features/purchaseApi";
import { Navigate, useParams } from "react-router-dom"

export const PurchaseCourseProtectedRoute=({children})=>{
 const params=useParams();
 const {courseId}=params;
 const {data,isLoading}=useGetCourseDetailsWithStatusQuery(courseId);
 
   if(isLoading) return <h1> Loading.....</h1>
   console.log(data);
 
   return data.purchased? children:<Navigate to={`/course-detail/${courseId}`}/>
}