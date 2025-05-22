import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn, userLoggedOut } from './authSlice';

const BASE_URL1="http://localhost:5000/api/v1/user/";
const BASEURL2="http://localhost:3000/api/v1/user/"
const USER_API=BASE_URL1||BASEURL2

export const authApi=createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        registerUser:builder.mutation({
            query:(inputData)=>({
             url:"register",
             method:"POST",
             body:inputData
            })
        }),
        loginUser:builder.mutation({
            query:(inputData)=>({
                url:"login",
                method:"POST",
                body:inputData
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled; 
                    dispatch(userLoggedIn({user:result.data.user})); 
                } catch (error) {
                    console.log("Login failed:", error);
                }
            }
        }),
        logoutUser:builder.mutation({
            query:()=>({
                url:"logout",
                method:"GET",
            }),
            async onQueryStarted(_,{dispatch}){
                    try {
                        dispatch(userLoggedOut({user:null}))
                    } catch (error) {
                        console.log("logout failed:", error);
                    }
            }
        }),
        loadUser:builder.query({
            query:()=>({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled; 
                    dispatch(userLoggedIn({user:result.data.user})); 
                } catch (error) {
                    console.log("Login failed:", error);
                }
            }
        }),
        updateUser:builder.mutation({
            query:(formData)=>({
                url:"profile/update",
                method:"PUT",
                body:formData,
            })
        })
    })
});
export const {
        useLoginUserMutation,
        useRegisterUserMutation,
        useLogoutUserMutation,
        useLoadUserQuery,
        useUpdateUserMutation
}=authApi