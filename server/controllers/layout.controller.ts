import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/error";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";
import { title } from "process";

// create layout --- only for admin
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {type} = req.body;
        const isTypeExist = await LayoutModel.findOne({type});

        if(isTypeExist){
            return next(new ErrorHandler(`${type} already exist`, 400));
        }

        if(type === "Banner"){
            const {image, title, subTitle} = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image,{folder:"layout",});
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title, 
                subTitle
            }
            await LayoutModel.create({type,banner});
        }
        if(type === "FAQ"){
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )
            await LayoutModel.create({type: "FAQ", faq: faqItems});
        }
        if(type === "Categories"){
            const {Categories} = req.body;
            const CategorieItems = await Promise.all(
                Categories.map(async(item:any)=>{
                    return {
                        title: item.title,
                    }
                })
            )
            await LayoutModel.create({type: "Categories", Categories: CategorieItems});
        }
        res.status(200).json({
            success: true,
            message: "Layout created successfully",
          });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// create layout --- only for admin
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {type} = req.body;

        if(type === "Banner"){
            const bannerData:any = await LayoutModel.findOne({type:"Banner"});
            const {image, title, subTitle} = req.body;
            if(bannerData){
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(image,{folder:"layout",});
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title, 
                subTitle
            }
            await LayoutModel.findByIdAndUpdate(bannerData.id,{banner});
        }
        if(type === "FAQ"){
            const {faq} = req.body;
            const FaqItem = await LayoutModel.findOne({type:"FAQ"});

            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(FaqItem?._id,{type: "FAQ", faq: faqItems});
        }
        if(type === "Categories"){
            const {Categories} = req.body;
            const CategoriesItem = await LayoutModel.findOne({type:"Categories"});
            const CategorieItems = await Promise.all(
                Categories.map(async(item:any)=>{
                    return {
                        title: item.title,
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(CategoriesItem?._id, {type: "Categories", Categories: CategorieItems});
        }
        res.status(200).json({
            success: true,
            message: "Layout Updated successfully",
          });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});