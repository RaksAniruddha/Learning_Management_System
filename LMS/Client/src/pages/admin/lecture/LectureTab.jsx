import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function LectureTab() {
    const MEDIA_API = "http://localhost:5000/api/v1/media";
    const [lectureTitle, setLectureTitle] = useState();
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const params = useParams();
    const { courseId, lectureId } = params;

    const {data:lectureData}=useGetLectureByIdQuery(lectureId);
    const lecture=lectureData?.lecture;
    useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree||isFree);
            setUploadVideoInfo(lecture.videoInfo);
        }
    },[lecture])
    const [editlecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture,{data:removeData,isLoading:removeLoading,isSuccess:removeSuccess}]=useRemoveLectureMutation();

    // For video upload we use axious the entry point is defiend at media route
    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, ({
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                }));
                if (res.data.success) {
                    console.log(res.data);

                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setBtnDisabled(false);
                    toast.success(res.data.massege)
                }

            } catch (error) {
                console.log(error);
                toast.error("video upload faield");
            } finally {
                setMediaProgress(false);
            }
        }
    }

    // edit lecture 
    const editLectureHandler = async () => {
        console.log(isFree);
        
        await editlecture({
            lectureTitle: lectureTitle,
            videoInfo: uploadVideoInfo,
            isPreviewFree: isFree,
            courseId,
            lectureId
        });
    }

    // remove lecture function calling
    const removeLectureHandler=async()=>{
        await removeLecture(lectureId);
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.massege);
        }
        if (error) {
            toast.error(error.data?.massege);
        }
    }, [isSuccess, data, error])

    // use effect for remoev success
    useEffect(()=>{
        if(removeSuccess){
            toast.success(removeData.massege)
        }
    },[removeSuccess])
    return (
        <Card>
            <CardHeader>
                <div className='space-y-1.5'>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>
                        Make Changes and Click save when Done.
                    </CardDescription>
                </div>
                <div className='flex items-center gap-2 mt-1.5'>
                    <Button variant="destructive" onClick={removeLectureHandler} disabled={removeLoading}>
                        {
                            removeLoading?(<>
                                <Loader2 className='mr-2 animate-spin h-4 w-4'/>Please Wait
                            </>):(<p>Remove Lecture</p>)
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => { setLectureTitle(e.target.value) }}
                        placeholder="EX. Introduction to javascript"
                    />
                </div>
                <div className='my-5 space-y-2'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex.Introduction to javaScript"
                        className="w-fit"
                    />
                </div>
                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className='flex items-center gap-2 space-x-2'>
                    <Switch id="airoplane-mode"
                         checked={isFree}
                         onCheckedChange={()=>{ 
                            setIsFree(!isFree);
                            }}
                     />
                    <Label htmlFor="airoplane-mode">Is this video FREE</Label>
                </div>
                <div className='mt-4'>
                    <Button onClick={editLectureHandler} disabled={isLoading}>
                        {
                            isLoading ? (<>
                                <Loader2 className='mr-2  animate-spin' />
                                please Wait
                            </>) : (<p>Update lecture</p>)
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab