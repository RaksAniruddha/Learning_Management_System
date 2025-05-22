import { Menu, MenuIcon, School } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Darkmode from '../Darkmode.jsx';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useLogoutUserMutation } from '@/features/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
function Navber() {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const logoutHandler = async () => {
        await logoutUser();
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.massege || "User Log Out");
            navigate('/login');
        }
    }, [isSuccess]);

    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* Desktop */}
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
                <Link to="/">
                    <div className='flex items-center gap-2'>
                        <School size={"30"} />
                        <h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1>
                    </div>
                </Link>
                {/* user icon and dark mode icon */}
                <div className='flex items-center gap-8'>
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to='/my-learning'> My Learning</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link to="/profile">Edit Profile</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuItem onClick={logoutHandler}>
                                        Log out
                                    </DropdownMenuItem>
                                    {
                                        user.role === "instructor" && (<>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                               <Link to="/admin/dashboard">Dashboard</Link>
                                            </DropdownMenuItem></>)
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Button variant="outline" onClick={() => (navigate("/login"))}>login</Button>
                                <Button onClick={() => (navigate("/login"))}>Signup</Button>
                            </div>
                        )
                    }
                    <Darkmode />
                </div>
            </div>
            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl'>E-Learning</h1>
                <MobileNavber />
            </div>
        </div>
    )
}

export default Navber

const MobileNavber = () => {
    const role = "instructor"
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row justify-between items-center mt-8">
                    <SheetTitle>E-Learning</SheetTitle>
                    <Darkmode />
                </SheetHeader>
                <Separator className='mr-2' />
                <nav className='flex flex-col space-y-3 ml-4'>
                    <span>My Learning</span>
                    <span>Edit Profile</span>
                    <span>Log Out</span>
                </nav>
                {
                    role === 'instructor' && (
                        <SheetFooter className="my-0">
                            <SheetClose asChild>
                                <Button type="submit">Dashboard</Button>
                            </SheetClose>
                        </SheetFooter>
                    )
                }

            </SheetContent>
        </Sheet>
    )

}