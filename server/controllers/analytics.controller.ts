import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/error";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get users analytics --- only for admin
export const getUserAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthData(userModel);
        res.status(200).json({
            success: true,
            users,
          });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// get courses analytics --- only for admin
export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthData(CourseModel);
        res.status(200).json({
            success: true,
            courses,
          });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// get orders analytics --- only for admin
export const getOrderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthData(OrderModel);
        res.status(200).json({
            success: true,
            orders,
          });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});