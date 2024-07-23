import React from 'react'

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: any
}

const CoursePreview:React.FC<Props> = ({
    active,
    setActive,
    courseData,
    handleCourseCreate
}) => {
  return (
    <div>CoursePreview</div>
  )
}

export default CoursePreview