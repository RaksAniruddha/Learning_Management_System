import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL1 = "http://localhost:5000/api/v1/purchase/";
const BASEURL2 = "http://localhost:3000/api/v1/purchase"
const COUESE_PURCHASE_API = BASE_URL1 || BASEURL2


export const purchaseApi=createApi({
    reducerPath:"purchaseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:COUESE_PURCHASE_API,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        getCourseDetailsWithStatus:builder.query({
            query:(courseId)=>({
                url:`/course/${courseId}/detail-with-status`,
                method:"GET"
            })
        }),
        getAllPurchaseCourse:builder.query({
            query:()=>({
                url:`/`,
                method:"GET"
            })
        })
    })
})

export const {useGetAllPurchaseCourseQuery,useGetCourseDetailsWithStatusQuery}=purchaseApi;