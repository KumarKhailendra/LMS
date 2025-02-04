'use client';
import dynamic from 'next/dynamic'
const AdminSidebar = dynamic(() => import('@/components/Admin/AdminSidebar'), { ssr: false })
import AdminProtected from '@/hooks/adminProtected'
import Heading from '@/utils/Heading'
import React from 'react'
const UserAnalytics = dynamic(() => import('@/components/Admin/Analytics/UserAnalytics'), { ssr: false })
const DashboardHero = dynamic(() => import('@/components/Admin/DashboardHero'), { ssr: false })

type Props = {}

const page:React.FC<Props> = () => {
  return (
    <div>
        <AdminProtected>
            <Heading 
                title='LMS - Admin User Analytics'
                description="LMS is a platform for student to learn and get help from teachers"
                keywords="Programing, MERN, Redux, Machine Learning"
            />
            <div className="flex h-screen">
                <div className="1500px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashboardHero />
                    <UserAnalytics />
                </div>
            </div>
        </AdminProtected>
    </div>
  )
}

export default page