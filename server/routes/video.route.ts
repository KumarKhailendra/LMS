import express, { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { deleteVideo, getAllVideos, streamVideoByIdAndResolution, uploadVideoAndId } from '../controllers/video.controller';

const videoRouter = express.Router();

// Set up Multer storage
const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    },
});

// File filter for video files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /mp4|avi|mkv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

// Routes
videoRouter.post('/upload', upload.single('video'), uploadVideoAndId);
videoRouter.get('/video/:id/:resolution', streamVideoByIdAndResolution);
videoRouter.get('/all', getAllVideos);
videoRouter.delete('/delete/:id', deleteVideo);

export default videoRouter;
