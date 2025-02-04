import { useGetUsersAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import React, { useEffect, useState } from 'react'
import CourseCard from '../Course/CourseCard'

type Props = {}

const Courses = (props: Props) => {
    const {data, isLoading} = useGetUsersAllCoursesQuery({})
    const [courses, setCourses] = useState<any[]>([]);
    
    useEffect(()=> {
        setCourses(data?.courses)
    },[data])
  return (
    <div>
        <div className={`w-[90%] 800px:w-[80%] m-auto`}>
            <h1 className={`text-center font-Poppins text-[25px] leading-9 sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight`}>
                Expand Your Career {" "}
                <span className={`text-[#4acd8d]`}>
                    Opportunity
                </span><br />
                Opportunity With Our Course
            </h1>
            <br />
            <br />
            <div className={`grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6 1500px:grid-cols-4 1500px:gap-9 mb-12 border-0`}>
                {
                    courses && courses.map((course:any, index:number) => (
                        <CourseCard 
                            item={course}
                            key={index}
                        />
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Courses