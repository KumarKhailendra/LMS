"use client";
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AllCourses from '@/components/Admin/Course/AllCourses';
import DashboardHero from '@/components/Admin/DashboardHero';
import AdminProtected from '@/hooks/adminProtected';
import Heading from '@/utils/Heading'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <AdminProtected>
            <Heading
                title={`LMS - Admin`}
                description="LMS is a platform for student to learn and get help from teachers"
                keywords="Programing, MERN, Redux, Machine Learning"
            />
            <div className="flex h-screen">
                <div className="1500px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashboardHero />
                    <AllCourses />
                </div>
            </div>
        </AdminProtected>
    )
}

export default page