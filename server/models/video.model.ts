import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IResolution {
  resolution: string;
  filepath: string;
  resolutionStutas: number;
}

export interface IVideo extends Document {
  originalFilename: string;
  originalFilePath: string;
  resolutions: IResolution[];
  resolutionsStutas: number;
  createdAt: Date;
  updatedAt: Date;
}

const resolutionSchema = new Schema<IResolution>({
  resolution: { type: String },
  filepath: { type: String },
  resolutionStutas: {type: Number} // running-0, done-1, error-2
});

const videoSchema = new Schema<IVideo>({
  originalFilename: { type: String, required: true },
  originalFilePath: { type: String, required: true },
  resolutions: { type: [resolutionSchema] },
  resolutionsStutas: {type: Number} // running-0, done-1, error-2
}, { timestamps: true });

const Video: Model<IVideo> = mongoose.model<IVideo>('Video', videoSchema);

export default Video;