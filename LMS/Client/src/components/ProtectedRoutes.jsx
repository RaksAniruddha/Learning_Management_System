import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoutes=({children})=>{
    const {isAuthenticated}=useSelector(store=>store.auth);
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    return children;
}

export const AuthenticatedUser=({children})=>{
    const {isAuthenticated}=useSelector(store=>store.auth);
    if(isAuthenticated){
        return <Navigate to="/"/>
    }
    return children;
}

export const AdminRoutes=({children})=>{
    const {user,isAuthenticated}=useSelector(store=>store.auth);
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    if(user.role!=="instructor"){
        return <Navigate to="/"/>
    }
    return children;
}

