import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/error";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notification.model";
const cron = require('node-cron');


// get all notifications --- only admin
export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success: true,
            notifications,
        })
    } catch (err:any) {
        return next(new ErrorHandler(err.message, 500));
    }
})

// update notifications status --- only admin
export const updateNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler("Notification not found", 404));
        }

        notification.status ? notification.status = "read" : notification.status;

        await notification.save();
        
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success: true,
            notifications,
        })
    } catch (err:any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// delete notification --- only admin
cron.schedule("0 0 0 * * *", async() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({status: "read", createAt: {$lt: thirtyDaysAgo}});
});