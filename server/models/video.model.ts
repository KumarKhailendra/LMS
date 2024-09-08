import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IResolution {
  resolution: string;
  filepath: string;
}

export interface IVideo extends Document {
  originalFilename: string;
  resolutions: IResolution[];
  createdAt: Date;
  updatedAt: Date;
}

const resolutionSchema = new Schema<IResolution>({
  resolution: { type: String },
  filepath: { type: String },
});

const videoSchema = new Schema<IVideo>({
  originalFilename: { type: String, required: true },
  resolutions: { type: [resolutionSchema] },
}, { timestamps: true });

const Video: Model<IVideo> = mongoose.model<IVideo>('Video', videoSchema);

export default Video;