'use client';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import CreateCourse from '@/components/Admin/Course/CreateCourse';
import DashboardHeader from '@/components/Admin/DashboardHeader';
import Heading from '@/utils/Heading';
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <Heading 
        title='LMS - Admin'
        description='LMS is a platform for traiding student to learn and get help from experts'
        keywords='Programming, MERN, Redux, AI'
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </div>
  )
}

export default page