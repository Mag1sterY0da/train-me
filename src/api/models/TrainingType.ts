import mongoose, { Schema } from 'mongoose';
import { ITrainingType } from '../../interfaces/ITrainingType.ts';

const trainingTypesSchema: Schema<ITrainingType> = new Schema<ITrainingType>({
  type: {
    type: String,
    required: true,
  },
  load: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
  },
  distance: {
    type: Number,
    required: false,
  },
  color: {
    type: String,
    required: true,
  },
});

const TrainingType = mongoose.model<ITrainingType>(
  'trainingTypes',
  trainingTypesSchema,
  'training-types'
);

export default TrainingType;
