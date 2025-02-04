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
import { isDirectoryExist } from '../helper/comman.helper';

interface ConversionPromiseResult {
    resolution: string;
    filepath: string;
}

// const ongoingConversions: Map<string, ffmpeg.FfprobeData[]> = new Map();
const ongoingConversions = new Map<string, ffmpeg.FfmpegCommand>();

export const uploadVideoAndId = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const filePath = req.file?.path as string;

        const filename = path.basename(filePath, path.extname(filePath));

        if (!filePath) return next(new ErrorHandler('No file uploaded', 400));

        ffmpeg.ffprobe(filePath, async (err: Error | null, metadata: FfprobeData) => {

            if (err) return next(new ErrorHandler(`Error processing video: ${err.message}`, 500));

            const videoHeight = metadata.streams[0].height?? metadata.streams[1].height;
            const videoDuration = metadata.format.duration;
            console.log(">>>>>>>>>>>>>>metadata.streams[0]", metadata.streams);
            

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

            const video = new Video({ originalFilename: filename, originalFilePath: filePath, resolutionsStutas: 0 });
            await video.save();
            res.status(200).json({ resolutions: filteredResolutionsKeys, id: video._id, duration: videoDuration });
            await generateResolutions(filePath, filename, filteredResolutionsValues, video);
            video.resolutionsStutas = 1;
            await video.save();
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});


const generateResolutions = (filePath: string, filename: string, resolutions: string[], video: IVideo): Promise<ConversionPromiseResult[]> => {

    const promises = resolutions.map((resolution, index) => {
        return new Promise<ConversionPromiseResult>(async (resolve, reject) => {

            try {
                isDirectoryExist('uploads')
                const outputPath = `uploads/${filename}-${resolution.substring(2)}.mp4`;
                console.log(`Processing ${outputPath}`);
                const ffmpegProcess = ffmpeg(filePath)
                    .output(outputPath)
                    .size(resolution)
                    .on('progress', function (progress: any) {
                        console.log('Processing: ', resolution.substring(2) + " :" + Math.round(progress.percent + 1.9) + '% done');
                    })
                    .on('start', async () => {
                        video.resolutions.push({ resolution: resolution.substring(2), filepath: outputPath, resolutionStutas: 0 })
                    })
                    .on('end', async () => {
                        const resolutionIndex = video.resolutions.findIndex(r => r.filepath === outputPath);
                        if (resolutionIndex !== -1) {
                            video.resolutions[resolutionIndex].resolutionStutas = 1; // Mark as done
                            // await video.save()
                        }
                        ongoingConversions.delete(outputPath)
                        resolve({ resolution: resolution.substring(2), filepath: outputPath });
                    })
                    .on('error', async (err: Error) => {
                        console.error('Error during conversion:', err);
                        const resolutionIndex = video.resolutions.findIndex(r => r.filepath === outputPath);
                        if (resolutionIndex !== -1) {
                            video.resolutions[resolutionIndex].resolutionStutas = 2; // Mark as error
                            // await video.save()
                        }
                        ongoingConversions.delete(outputPath);
                        reject(err);
                    });
                ongoingConversions.set(outputPath, ffmpegProcess);
                ffmpegProcess.run();

            } catch (error) {
                console.error('Unhandled error during conversion:', error);
                reject(error);
            }
        });
    });
    console.log("ongoingConversions>>>>>>>>>>>>>", ongoingConversions);

    return Promise.all(promises).catch((err) => {
        console.error('Error during resolution generation:', err);
        throw err;  // Re-throw the error if necessary
    });
};

const stopOngoingConversions = (videoName: string) => {
    ongoingConversions.forEach((process: any, filePath: string) => {
        if (filePath.includes(videoName)) {
            process.ffmpegProc.stdin.write('q');
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

        let videoPath ;
        if(resolution === 'original'){
            videoPath = video.originalFilePath;
        }else{
            const resFile = video.resolutions.find((res) => res.resolution === resolution);
            if (!resFile) return res.status(404).json({ message: 'Resolution not found' });
            videoPath = path.join(__dirname, '../', resFile.filepath);
        }

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
// Get video resolution
export const getAllVideoResolutions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await Video.findById(req.params.id);
        const resolution = ['original']
        video?.resolutions.map((item)=>{
            resolution.push(item.resolution)
        })

        res.status(200).json(resolution);
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));

    }
});

export const deleteVideo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Find the video and related resolution files
        const videos = await Video.findById(id);
        if (!videos) return res.status(404).json({ message: 'Video not found' });
        stopOngoingConversions(videos.originalFilename)
        await new Promise(resolve => setTimeout(resolve, 3000));

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Stop ongoing conversions for this video
        fs.unlinkSync(path.join(__dirname, '../', video.originalFilePath));
        // Delete resolution files
        const filePathArr = video.resolutions;
        for (const file of filePathArr) {
            fs.unlinkSync(path.join(__dirname, '../', file.filepath));
            console.log(`Deleted file: ${file.filepath}`);
        }

        // Delete the video record from the database
        await Video.findByIdAndDelete(id);
        res.status(200).json({ message: 'Video and resolutions deleted successfully' });

    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});
