import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, menuClasses } from 'react-pro-sidebar';
import { useSelector } from 'react-redux';
import { ArrowBackIosIcon, ArrowForwardIosIcon, BarChartOutlinedIcon, ExitToAppIcon, GroupsIcon, HomeOutlinedIcon, ManageHistoryIcon, MapOutlinedIcon, OndemandVideoIcon, PeopleOutlinedIcon, QuizIcon, ReceiptOutlinedIcon, SettingsIcon, VideoCallIcon, WebIcon, WysiwygIcon } from './icon';
import Image from 'next/image';
import { stringAvatar } from '../Header';

type Props = {}

interface itemsProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}

const Item: FC<itemsProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Link href={to} passHref>
      <MenuItem
        active={selected === title}
        onClick={() => setSelected(title)}
        icon={icon}
        rootStyles={{
          ['.' + menuClasses.button]: {
            backgroundColor: 'transparent !important',
            '&:hover': {
              backgroundColor: 'transparent !important',
            },
          },
        }}
      >
        <Typography className='!text-[16px] !font-Poppins'>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

const AdminSidebar = (props: Props) => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    setLogout(true);
  }

  return (
    <Box className="!bg-white dark:bg-black">
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={`${theme === "dark" ? "#111c43 !important" : "#fff !important"}`}
        rootStyles={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          color: theme === "dark" ? "#fff" : "#000",
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        <Menu menuItemStyles={{
          button: ({ level, active }) => {
            // only apply styles on first level elements of the tree
            if (level === 0)
              return {
                color: active ? '#5b6fe6' : `${theme === "dark" ? "#ffffffc1 !important" : "#111c43 !important"}`,
                backgroundColor: active ? 'transparent !important' : undefined,
              };
          },
        }} >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            rootStyles={{
              margin: "10px 0 20px 0",
              ['.' + menuClasses.button]: {
                backgroundColor: 'transparent !important',
                '&:hover': {
                  color: theme === "dark" ? "#fff" : "#000",
                  backgroundColor: 'transparent !important',
                },
              },
            }}
          >
            {
              !isCollapsed && (
                <Box display="flex" justifyContent={"space-between"} alignItems={"center"} ml={"15px"}>
                  <Link href={"/"}>
                    <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">LMS</h3>
                  </Link>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)} className='inline-block'>
                    <ArrowBackIosIcon className='dark:text-white text-black"' />
                  </IconButton>
                </Box>
              )
            }
          </MenuItem>
          {
            !isCollapsed && (
              <Box mb={"25px"}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                  {
                    user.avatar ? (
                      <>
                        <Image
                          src={user?.avatar?.url}
                          alt="profile-user"
                          width={100}
                          height={100}
                          className="w-[100px] h-[100px] rounded-full cursor-pointer border-[3px] border-solid border-[#5b6fe6]"
                        />
                      </>
                    ) : (
                      <Avatar {...stringAvatar(user.name)} sx={{ width: 100, height: 100, cursor: 'pointer', border: "3px solid #5b6fe6" }} />
                    )
                  }
                </Box>
                <Box textAlign={"center"}>
                  <Typography variant='h4' className="!text-[20px] text-black dark:text-[#ffffffc1]" sx={{ m: "10px 0 0 0" }}>
                    {user?.name}
                  </Typography>
                  <Typography variant='h6' className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize">
                    {user?.role}
                  </Typography>
                </Box>
              </Box>
            )
          }
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title='Dashboard'
              to='/admin'
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant='h5' sx={{ m: "15px 0 5px 25px" }} className='!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title='Users'
              to='/admin/users'
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Invoices'
              to='/admin/invoices'
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant='h5' sx={{ m: "15px 0 5px 25px" }} className='!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title='Create Course'
              to='/admin/create-course'
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Live Courses'
              to='/admin/courses'
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant='h5' sx={{ m: "15px 0 5px 25px" }} className='!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title='Hero'
              to='/admin/hero'
              icon={<WebIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='FAQ'
              to='/admin/faq'
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Categories'
              to='/admin/categories'
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant='h5' sx={{ m: "15px 0 5px 25px" }} className='!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item
              title='Manage Team'
              to='/admin/team'
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant='h5' sx={{ m: "15px 0 5px 25px" }} className='!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item
              title='Courses Analytics'
              to='/admin/courses-analytics'
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Orders Analytics'
              to='/admin/orders-analytics'
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Users Analytics'
              to='/admin/users-analytics'
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant='h5' sx={{ m: "15px 0 5px 25px" }} className='!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]'>
              {!isCollapsed && "Extras"}
            </Typography>
            <Item
              title='Settings'
              to='/admin/settings'
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Logout'
              to='/admin/settings'
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  )
}

export default AdminSidebar