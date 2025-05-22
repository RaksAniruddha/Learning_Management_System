import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

function CourseTab() {
    
    //get Id By params
    const params = useParams();
    const courseId = params.courseId;
    const { data: CourseByIdData, isLoading: CourseByIdLoading,refetch:getCourseBYIdRefetch } = useGetCourseByIdQuery(courseId);

    const [editCourse, { data, isLoading, error, isSuccess }] = useEditCourseMutation();

    const [publishCourse]=usePublishCourseMutation();

    // useEffect for showing massage
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.massege || "Updated Succesfully");
        }
        if (error) {
            toast.error(error?.data?.massege || "failed to update")
        }
    }, [error, isSuccess])

    // set Data after fetching course Data 
    useEffect(() => {
        if (CourseByIdLoading === false && CourseByIdData.course) {
            const course = CourseByIdData.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                coursePrice: course.coursePrice,
                courseLevel: course.courseLevel,
                courseThumbnail:course.courseThumbnail
            });
        }
    }, [CourseByIdData])

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        coursePrice: "",
        courseLevel: "",
        courseThumbnail: ""
    });
    const [preViewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }
    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    }
    const selectThumbnail = (e) => {
        const file = e.target.files[0];
        console.log(file);
        
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }
    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseLevel", input.courseLevel);
        formData.append("courseThumbnail", input.courseThumbnail);
        await editCourse({ formData, courseId });
    }

    const publishStatusHandler=async(action)=>{
        try {
            console.log(action);
            
            const response=await publishCourse({courseId,query:action});
            if(response.data){
                toast.success(response.data.massege);
                getCourseBYIdRefetch();
            }
        } catch (error) {
           toast.error("faield to publish or unpublish course");
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make Changes to your courses here. Click save when You are done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button variant="outline" disabled={CourseByIdData?.course.lectures.length===0} onClick={()=>{publishStatusHandler(CourseByIdData?.course.isPublished?"false":"true")}}>
                        {
                           CourseByIdData?.course.isPublished? "Unpublished" : "Published"
                        }
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Full Stack Developer" />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Full stack Developer from Zero to Hero in 2 months" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
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
                        <div>
                            <Label>Course level</Label>
                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price In (Inr)</Label>
                            <Input type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="xxx"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input type="file"
                            accept="image/*"
                            onChange={selectThumbnail}
                            className="w-fit" />
                        {
                            preViewThumbnail && <img src={preViewThumbnail} className='h-30 w-fit my-2' alt="" />
                        }
                    </div>
                    <div className=" flex gap-1 items-center">
                        <Button variant="outline" onClick={() => { navigate("/admin/course") }}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>{
                            isLoading ? <>
                                <Loader2 className='animate-spin h-4 w-2 mr-1' />
                                Please wait
                            </>
                                : (<p>save</p>)
                        }</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab