import { Response } from "express";
import { CatchAsyncError } from "../middleware/error";
import CourseModel from "../models/course.model";


// create course
export const createCourse = CatchAsyncError(async (data:any, res: Response)=>{
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    })
})

//Get all courses
export const getAllCourseServive = async(res: Response) => {
    const course = await CourseModel.find().sort({ createdAt: -1});
    res.status(201).json({
        success: true,
        course,
    })
};