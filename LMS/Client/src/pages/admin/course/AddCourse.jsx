import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useCreateCourseMutation } from '@/features/courseApi'
import { toast } from 'sonner'

function Addcourse() {
  const [courseTitle,setCourseTitle]=useState('');
  const [category,setCategory]=useState('');
  const navigate=useNavigate();
  const [createCourse,{data,isLoading,isSuccess,error,isError}]=useCreateCourseMutation();
  
  const getSelectedCategory=(value)=>{
     setCategory(value);
  }
  const createCourseHandler= async()=>{
    await createCourse({courseTitle,category});
  }

  //useEffect Initialization for messege display
  useEffect(()=>{
    if(isSuccess){
      toast.success(data?.massege||"Course Created Successfully");
      navigate("/admin/course");
    }
    if(isError){
      toast.error(error?.massege||"Something Wrong...")
    }
  },[isSuccess,error,data,isError])
  return (
    <div className="flex-1 mx-10 ">
      <div className="mb-4">
        <h1 className='font-bold text-xl'>Lets Add Course, add some
          basic course details for your new course</h1>
        <p className=' text-sm mt-0.5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, tenetur.</p>
      </div>
      <div className='space-y-4'>
        <div>
          <Label>Title</Label>
          <Input type="text"
            name="courseTitle"
            value={courseTitle}
            onChange={(e)=>{setCourseTitle(e.target.value)}}
            placeholder="Your Course Name" />
        </div>
        <div>
          <Label>Category</Label>
          <Select  onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next Js">Next Js</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Front End Development">Front End Development</SelectItem>
                <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDb">MongoDb</SelectItem>
                <SelectItem value="Html">Html</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={()=>{navigate("/admin/course")}}>Back</Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {
              isLoading?(
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin '/>
                please wait
              </>):"Create"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Addcourse