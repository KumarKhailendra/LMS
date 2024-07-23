"use client";
import CustomModal from "@/utils/CustomModal";
import NavItems from "@/utils/NavItems";
import { ThemeSwitcher } from "@/utils/ThemeSwitcher";
import Link from "next/link";
import React, { FC, useState, useEffect, use } from "react";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import Avatar from '@mui/material/Avatar';
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({activeItem, setOpen, route, setRoute, open}) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {user} = useSelector((state: any)=> state.auth);
  const {data} = useSession();
  const [socialAuth, {isSuccess, error}] = useSocialAuthMutation()
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  })
  
  useEffect(()=>{
    if(!user){
      if(data){
        socialAuth({email:data?.user?.email, name: data?.user?.name, avatar: data?.user?.image})
      }
    }
    if(isSuccess && data === null){
      const message = "Login successfully!";
      toast.success(message);
      setOpen(false);
    }
    if(data !== null){
      setLogout(true)
    }
    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message);
      }else{
        toast.error(`An error occured ${error}`);
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user, data])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e:any) => {
    if(e.target.id === "screen"){
      setOpenSidebar(false)
    }
  }
  
  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
            <div className="w-full h-[80px] flex items-center justify-between p-3">
                <div className="">
                    <Link href='/' className="text-[25px] font-Poppins font-[500] text-black dark:text-white" passHref>
                        BuyLMS
                    </Link>
                </div>
                <div className="flex items-center">
                    <NavItems activeItem={activeItem} isMobile={false} />
                    <ThemeSwitcher />
                    {/* only for mobile  */}
                    <div className="800px:hidden">
                      <HiOutlineMenuAlt3 
                        size={25}
                        className="cursor-pointer dark:text-white text-black"
                        onClick={()=> setOpenSidebar(true)}
                      />
                    </div>
                    {
                      user ? (
                        <>
                          <Link href={"/profile"}>
                          {
                            user.avatar ? (
                              <>
                              <Image 
                                src={user?.avatar?.url}
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
                          </Link>
                        </>
                      )
                      : (
                        <HiOutlineUserCircle 
                          size={25}
                          className="hidden 800px:block cursor-pointer dark:text-white text-black"
                          onClick={()=> setOpen(true)}
                        />
                      )
                    }
                </div>
            </div>
        </div>
        {/* mobile sidebar  */}
        {
          openSidebar && (
            <div 
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]" 
            onClick={handleClose}
            id="screen"
            >
              <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                <NavItems activeItem={activeItem} isMobile={true} />
                <HiOutlineUserCircle 
                      size={25}
                      className="cursor-pointer dark:text-white text-black"
                      onClick={()=> setOpen(true)}
                />
                <br/><br/>
                <p className="text-[16px] px-2 pl-5 text-black dark:text-white">Copyright &copy; 2023 BuyLMS</p>
              </div>
            </div>
          )
        }
      </div>
      {
        route === "Login" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Login}
                />
              )
            }
          </>
        )
      }
      {
        route === "Sign-Up" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={SignUp}
                />
              )
            }
          </>
        )
      }
      {
        route === "Verification" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Verification}
                />
              )
            }
          </>
        )
      }
    </div>
  );
};

export default Header;
