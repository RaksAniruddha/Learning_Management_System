import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL1 = "http://localhost:5000/api/v1/course/";
const BASEURL2 = "http://localhost:3000/api/v1/course/"
const USER_API = BASE_URL1 || BASEURL2

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes:['Refetch_Creator_Course','Refech_lecture'],
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category }
            }),
            invalidatesTags:['Refetch_Creator_Course'],
        }),
        getSearchCourse:builder.query({
            query:({searchQuery,categories,sortByPrice})=>{
                let queryString=`/search?query=${encodeURIComponent(searchQuery)}`
                
                // append category
                if(categories && categories.length>0){
                    const categoriesString=categories.map(encodeURIComponent).join(",");
                    queryString+=`&categories=${categoriesString}`
                }
                // Append Sort By Price
                if(sortByPrice){
                    queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`
                }
                
                return {
                    url:queryString,
                    method:"GET",
                }
            }
        }),
        getPublishedCourse:builder.query({
            query:()=>({
                url:"/published-courses",
                method:"GET"
            })
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            }),
            providesTags:['Refetch_Creator_Course'],
        }),
        editCourse:builder.mutation({
            query:({formData,courseId})=>({
               url:`/${courseId}`,
               method:"PUT",
               body:formData
            }),
            invalidatesTags:['Refetch_Creator_Course'],
        }),
        getCourseById:builder.query({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:"GET"  
            }),
            providesTags:['Refetch_Creator_Course'],
        }),
        // create lecture api Calling Start
        createLecture:builder.mutation({
            query:({lectureTitle,courseId})=>({
                url:`/${courseId}/lecture`,
                method:"POST",
                body:{lectureTitle}
            })
        }),
        getCourseLecture:builder.query({
            query:(courseId)=>({
                url:`/${courseId}/lecture`,
                method:"GET",
            }),
            providesTags:['Refech_lecture'],
        }),
        editLecture:builder.mutation({
            query:({lectureTitle,videoInfo,isPreviewFree,courseId,lectureId})=>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:"POST",
                body:{lectureTitle,videoInfo,isPreviewFree}
            })
        }),
        removeLecture:builder.mutation({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`,
                method:"DELETE"
            }),
            invalidatesTags:['Refech_lecture']
        }),
        getLectureById:builder.query({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`,
                method:"GET",
            })
        }),
        publishCourse:builder.mutation({
            query:({courseId,query})=>({
                url:`/${courseId}?publish=${query}`,
                method:"PATCH",
            })
        })
    })
})

export const { useCreateCourseMutation,
    useGetSearchCourseQuery,
    useGetCreatorCourseQuery,
    useGetPublishedCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
} = courseApi;