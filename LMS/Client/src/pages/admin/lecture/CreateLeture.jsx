import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Lecture from './Lecture';

function CreateLeture() {
    const [lectureTitle,setLectureTitle]=useState("");
    const navigate=useNavigate();
    const params=useParams();
    const courseId=params.courseId;
    
    const [createLecture,{data,isLoading,isSuccess,error}]=useCreateLectureMutation();

    const {data:lectureData,isLoading:lectureLoading,error:lectureError,refetch}=useGetCourseLectureQuery(courseId);

    // toast  for messege display
    useEffect(()=>{
        if(isSuccess){
            refetch();
            toast.success(data.massege);
        }
        if(error){
            toast.error(error.data.massege)
        }
    },[data,error,isSuccess])

    const createLeatureHandler=async()=>{
        await createLecture({lectureTitle,courseId});
    }
    return (
        <div>
            <div className="flex-1 mx-10 ">
                <div className="mb-4">
                    <h1 className='font-bold text-xl'>Lets Add Lecture,and some Baic detatils about your letcure</h1>
                    <p className=' text-sm mt-0.5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, tenetur.</p>
                </div>
                <div className='space-y-4'>
                    <div>
                        <Label>Title</Label>
                        <Input type="text"
                            name="courseTitle"
                            value={lectureTitle}
                            onChange={(e)=>{setLectureTitle(e.target.value)}}
                            placeholder="Your Course Name" />
                    </div>
                    <div className='flex gap-2'>
                        <Button variant="outline" onClick={()=>{navigate(`/admin/course/${courseId}`)}}>Back To Course</Button>
                        <Button disabled={isLoading} onClick={createLeatureHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin ' />
                                        please wait
                                    </>) : "Create Lecture"
                            }
                        </Button>
                    </div>
                    <div className="mt-10">
                        {lectureLoading?(<p>Loading Lecture....</p>):
                            lectureError?(<p>Faield to load</p>):
                                lectureData.lectures.length===0?<p>No lectures availabel</p>:
                                  lectureData.lectures.map((lecture,index)=>(
                                    <Lecture key={lectureData._id} courseId={courseId} lecture={lecture} index={index}/>
                                  ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateLeture