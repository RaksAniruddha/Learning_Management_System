import { configureStore } from "@reduxjs/toolkit";
// import authReducer  from '../features/authSlice.js' 
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/authApi.js";
import { courseApi } from "@/features/courseApi.js";
import { purchaseApi } from "@/features/purchaseApi.js";
import { courseProgressApi } from "@/features/courseProgressApi.js";

export const appStore=configureStore({
    // reducer:{
    //     authSlice:authReducer
    // }
    reducer:rootReducer,
    middleware:(defaultMiddleware)=> defaultMiddleware().concat(authApi.middleware,courseApi.middleware,purchaseApi.middleware,courseProgressApi.middleware)
});

const inializeApp= async()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
};
inializeApp();