import { Schema } from 'mongoose';

export interface ITrainingType {
  _id: Schema.Types.ObjectId;
  type: string;
  load: number;
  duration?: number;
  distance?: number;
  color: string;
}
