import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/error';
import ErrorHandler from '../utils/ErrorHandler';
import OrderModel, {IOrder} from '../models/order.model';
import userModel from '../models/user.model';
import CourseModel from '../models/course.model';
import NotificationModel from '../models/notification.model';
import { getAllOrderServive, newOrder } from '../services/order.service';
import { orderConfirmationMailService } from '../services/mailService';
import { redis } from '../utils/redis';
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {courseId, payment_info} = req.body as IOrder;

        if(payment_info){
            if("id" in payment_info){
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if(paymentIntent.status !== "succeeded"){
                    return next(new ErrorHandler("Payment not authorized", 400));
                }
            }
        }

        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = user?.courses.some((course:any)=>course._id.toString() === courseId);

        if(courseExistInUser){
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseId);

        if(!course){
            return next(new ErrorHandler("Course not found", 400));
        }

        const data: any = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        }

        const mailData = {
            order: {
                _id: course._id,
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}),
            }
        }
        if(user){
            orderConfirmationMailService(mailData.order, user.email)
        }
        let userCourseId : any = course._id;
        user?.courses.push(userCourseId);

        await redis.set(req.user?._id as string, JSON.stringify(user));

        await user?.save();

        await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });

        course?.purchased ? course.purchased += 1 : course.purchased = 1;

        await course.save();

        newOrder(data, res, next);
        
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});


// get all order --- only for admin
export const getAllOrders = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        getAllOrderServive(res)
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

export const sendStripePublishableKey = CatchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
});

// new payment
export const newPayment = CatchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            metadata: {
                company: "LMS",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});