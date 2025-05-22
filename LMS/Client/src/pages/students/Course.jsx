import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

function Course({ course }) {
    return (
        <Link to={`/course-detail/${course._id}`}>
            <Card className="overflow-hidden rounded-lg py-0 gap-0 dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                    <img src={course.courseThumbnail || "https://img-c.udemycdn.com/course/750x422/3873464_403c_3.jpg"}
                        alt='courses'
                        className='w-full h-36 object-cover rounded-t-lg' />
                </div>
                <CardContent className={'px-5 py-4 space-y-3'}>
                    <h1 className='hover:underline font-bold text-lg truncate'>{course.courseTitle}</h1>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={course.creator?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1 className='font-medium text-sm'>{course.creator?.name}</h1>
                        </div>
                        <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>{course.courseLevel}</Badge>
                    </div>
                    <div className='text-lg font-bold'>
                        <span>₹{course.coursePrice}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Course