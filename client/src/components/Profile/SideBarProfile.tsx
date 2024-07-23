import { Avatar } from '@mui/material';
import Image from 'next/image';
import React, { FC } from 'react'
import { stringAvatar } from '../Header';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';

type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({user,active,avatar,setActive,logoutHandler}) => {
  return (
    <div className='w-full'>
        <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 1 ? 'dark:bg-slate-800 bg-white' : 'bg-transparent'
        }`} onClick={()=> setActive(1)}>
            {
                user.avatar || avatar ? (
                    <>
                        <Image 
                            src={user?.avatar?.url || avatar}
                            alt=""
                            width={30}
                            height={30}
                            className="w-[30px] h-[30px] rounded-full cursor-pointer"
                        />
                    </>
                ): (
                    <Avatar {...stringAvatar(user.name)} sx={{ width: 30, height: 30, cursor: 'pointer' }} /> 
                )
            }
            <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">My Account</h5>
        </div>
        <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 2 ? 'dark:bg-slate-800 bg-white' : 'bg-transparent'
        }`} onClick={()=> setActive(2)}>
            <RiLockPasswordLine size={20} className="dark:text-white text-black" />
            <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">Change Password</h5>
        </div>
        <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 3 ? 'dark:bg-slate-800 bg-white' : 'bg-transparent'
        }`} onClick={()=> setActive(3)}>
            <SiCoursera size={20} className="dark:text-white text-black" />
            <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">Enrolled Courses</h5>
        </div>
        {
            user.role === "admin" && (
                <Link className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                    active === 5 ? 'dark:bg-slate-800 bg-white' : 'bg-transparent'
                }`} href={"/admin"}>
                    <MdOutlineAdminPanelSettings size={20} className="dark:text-white text-black" />
                    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">Admin Deshboard</h5>
                </Link>
            )
        }
        <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 4 ? 'dark:bg-slate-800 bg-white' : 'bg-transparent'
        }`} onClick={logoutHandler}>
            <AiOutlineLogout size={20} className="dark:text-white text-black" />
            <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">Log Out</h5>
        </div>
    </div>
  )
}

export default SideBarProfile