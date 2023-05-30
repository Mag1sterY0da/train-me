import mongoose, { Schema } from 'mongoose';
import { ITrainedModel } from '../../interfaces/ITrainedModel.ts';

const trainedModelSchema: Schema<ITrainedModel> = new Schema<ITrainedModel>({
  model: String,
});

const TrainedModel = mongoose.model<ITrainedModel>('model', trainedModelSchema);

export default TrainedModel;
