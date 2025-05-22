import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/authApi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Login() {
    const navigate=useNavigate();
    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [registerUser,
        { data: registerData,
            error: registerError,
            isLoading: registerIsLoading,
            isSuccess: registerIsSuccess }
    ] = useRegisterUserMutation();
    const [loginUser, { data: loginData,
        error: loginError,
        isLoading: loginIsLoading,
        isSuccess: loginIsSuccess }] = useLoginUserMutation();
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });
    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({
                ...signupInput,
                [name]: value
            })
        } else if (type === "login") {
            setLoginInput({ ...loginInput, [name]: value });
        }
    }
    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;
        await action(inputData);
    }
    useEffect(() => { 
       if(registerIsSuccess && registerData){
        toast.success(registerData.massege||"signup successfully");
       }
       if(registerError){
        toast.success(registerError.data.massege||"Signup faild")
       }
       if(loginIsSuccess && loginData){
        toast.success(loginData.massege||"login successfully");
        navigate('/');
       }
       if(loginError){
        toast.success(loginError.data.massege||"Signup faild")
       }
    },[
        loginIsLoading, 
        registerIsLoading,
        loginData, 
        registerData, 
        loginError, 
        registerError])
    return (
        <div className="flex items-center h-full mt-28 w-full justify-center">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" name="name" placeholder="Eg. jhon Doe" value={signupInput.name} required={true} onChange={(e) => { changeInputHandler(e, "signup") }} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" placeholder="Eg. jhondoe34@gmail.com" value={signupInput.email} required={true} onChange={(e) => { changeInputHandler(e, "signup") }} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">password</Label>
                                <Input placeholder="Eg .xyz" name="password" type="password" value={signupInput.password} required={true} onChange={(e) => { changeInputHandler(e, "signup") }} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerIsLoading} onClick={() => { handleRegistration("signup") }}>
                                {
                                    registerIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animated-spin" />
                                        </>) : "signup"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here, After signup you'll be logged in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" placeholder="Eg. jhondoe34@gmail.com" value={loginInput.email} required={true} onChange={(e) => { changeInputHandler(e, "login") }} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input placeholder="Eg .xyz" name="password" type="password" value={loginInput.password} required={true} onChange={(e) => { changeInputHandler(e, "login") }} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} onClick={() => { handleRegistration("login") }}>
                                {
                                    loginIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animated-spin" />
                                        </>) : "login"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
