import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/courseProgressApi'
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react'
import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function CourseProgress() {
  const isCompleted = true;
  const params = useParams();
  const { courseId } = params;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(()=>{
    if(completedSuccess){
      toast.success(markCompleteData.massege);
    } 
  },[completedSuccess])

  useEffect(()=>{
    if(inCompletedSuccess){
      toast.success(markInCompleteData.massege);
    }
  },[inCompletedSuccess])

  if (isLoading) return <p>Loading....</p>
  if (isError) return <p>Failed to Load</p>

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  const initialLecture = currentLecture || courseDetails.lectures[0];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  }

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  }

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  }

  const handleCompleteCourse = async () => {
    await completeCourse({ courseId });
    refetch();
  }
  const handleInCompleteCourse = async () => {
    await inCompleteCourse({ courseId });
    refetch();
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 mt-24">
      {/* diaplay course name */}
      <div className='flex justify-between mb-4'>
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button 
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed?"outline":"default"}
        >
          {
            completed?(
              <div className='flex items-center'>
                <CheckCircle className='h-4 w-4 mr-2'/> <span>Completed</span>{" "}
              </div>
            ):(
              "Mark As Complered"
            )
          }
        </Button>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* video section */}
        <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls={"true"}
              className='w-full h-auto md:rounded-lg'
              onPlay={() => { handleLectureProgress(currentLecture?._id || initialLecture._id) }}
            />
          </div>
          {/* Display current watching Lecture Title */}
          <div className='mt-2'>
            <h3 className='font-medium text-lg'>
              {
                `Lecture - ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture._id)) + 1}: ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`
              }
            </h3>
          </div>
        </div>
        {/* lecture sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className='flex-1 overflow-y-auto'>
            {
              courseDetails?.lectures.map((lecture) => {
                return (
                  <Card key={lecture._id}
                    className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? 'bg-gray-200' : 'dark:bg-gray-800'}`}
                    onClick={() => { handleSelectLecture(lecture) }}
                  >
                    <CardContent className="flex items-center justify-between p-4 ">
                      <div className='flex items-center'>
                        {
                          isLectureCompleted(lecture._id) ? (
                            <CheckCircle2 size={24} className='text-green-500 mr-2' />
                          ) : (
                            <CirclePlay size={24} className='text-gray-500 mr-2' />
                          )
                        }
                        <div className="text-lg font-medium">
                          <CardTitle className="text-lg font-medium">{lecture.lectureTitle}</CardTitle>
                        </div>
                      </div>
                      {
                        isLectureCompleted(lecture._id) && (<Badge variant={'outline'} className="bg-green-200 text-green-600 ">Completed</Badge>)
                      }

                    </CardContent>
                  </Card>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress