import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/error';
import ErrorHandler from '../utils/ErrorHandler';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';
const ffprobePath = require('ffprobe-static').path;
ffmpeg.setFfmpegPath(ffmpegPath as string);
ffmpeg.setFfprobePath(ffprobePath as string);
import Video, { IVideo } from '../models/video.model';
import path from 'path';

const ongoingConversions: Map<string, ffmpeg.FfprobeData[]> = new Map();

export const uploadVideoAndId = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const filePath = req.file?.path as string;

        const filename = path.basename(filePath, path.extname(filePath));

        if (!filePath) return next(new ErrorHandler('No file uploaded', 400));

        ffmpeg.ffprobe(filePath, async (err: Error | null, metadata: FfprobeData) => {

            if (err) return next(new ErrorHandler(`Error processing video: ${err.message}`, 500));

            const videoHeight = metadata.streams[0].height;

            const filteredResolutionsKeys: number[] = [];
            const filteredResolutionsValues: string[] = [];

            if (!videoHeight) return next(new ErrorHandler('Could not determine video resolution', 500));


            const resolutionsObj: Record<number, string> = { 144: '?x144', 240: '?x240', 360: '?x360', 480: '?x480', 720: '?x720', 1080: '?x1080', 1440: '?x1440', 2160: '?x2160', };

            Object.keys(resolutionsObj)
                .filter((key) => parseInt(key) <= videoHeight)
                .forEach((key) => {
                    filteredResolutionsKeys.push(parseInt(key));
                    filteredResolutionsValues.push(resolutionsObj[parseInt(key)]);
                });

            const video = new Video({ originalFilename: filePath });
            await video.save();
            res.status(200).json({ resolutions: filteredResolutionsKeys, id: video._id });
            await generateResolutions(filePath, filename, filteredResolutionsValues, video);
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

const generateResolutions = (filePath: string, filename: string, resolutions: string[], video: IVideo) => {
    const promises = resolutions.map((resolution: string) => {
        return new Promise((resolve, reject) => {
            const outputPath = `uploads/${filename}-${resolution.substring(2)}.mp4`;
            console.log(`Processing ${outputPath}`);

            const ffmpegProcess:any = ffmpeg(filePath)
                .output(outputPath)
                .size(resolution)
                .on('progress', function (progress: any) {
                    // socket.emit(resolution, { progress: Math.round(progress.percent + 1.9) });
                    console.log('Processing: ', resolution.substring(2) + " :" + Math.round(progress.percent + 1.9) + '% done');
                })
                .on('end', async () => {
                    video.resolutions.push({ resolution: resolution.substring(2), filepath: outputPath })
                    await video.save();
                    resolve({ resolution: resolution.substring(2), filepath: outputPath })
                })
                .on('error', reject)
                .run();

            ongoingConversions.set(outputPath, ffmpegProcess);
        });
    });
    return Promise.all(promises);
};

const stopOngoingConversions = (videoId: string) => {
    ongoingConversions.forEach((process: any, filePath: string) => {
        if (filePath.includes(videoId)) {
            // Kill the ffmpeg process ( ffmpeg processes can be stopped this way)
            process.kill();
            ongoingConversions.delete(filePath);
            console.log(`Stopped conversion for ${filePath}`);
        }
    });
};


export const streamVideoByIdAndResolution = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, resolution } = req.params;

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const resFile = video.resolutions.find((res) => res.resolution === resolution);
        if (!resFile) return res.status(404).json({ message: 'Resolution not found' });
        const videoPath = path.join(__dirname, '../', resFile.filepath);

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                return;
            }

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Get video metadata
export const getAllVideos = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));

    }
});

export const deleteVideo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Find the video and related resolution files
        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Stop ongoing conversions
        stopOngoingConversions(id);

        // Delete resolution files
        const filePathArr = video.resolutions;
        for (const file of filePathArr) {
            fs.unlinkSync(path.join(__dirname, '../', file.filepath));
            console.log(`Deleted file: ${file}`);
        }

        // Delete the video record from the database
        await Video.findByIdAndDelete(id);
        res.status(200).json({ message: 'Video and resolutions deleted successfully' });

    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});
