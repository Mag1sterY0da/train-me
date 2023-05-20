import { Schema } from 'mongoose';

export interface IUser {
  isLoggedIn?: boolean;
  _id?: Schema.Types.ObjectId;
  email: string;
  password: string;
  gender: 'male' | 'female';
  birthDate: Date;
  height: number;
  weight: number;
  fitnessLevel: 'minimum' | 'beginner' | 'moderate' | 'high' | 'extreme';
  avatar?: string; // base64
  nickname: string;
  plannedTrainings: {
    type: Schema.Types.ObjectId;
    distance?: number;
    duration?: number;
    date: Date;
    completed: boolean;
  }[];
  completedTrainings: {
    type: Schema.Types.ObjectId;
    distance?: number;
    duration?: number;
    date: Date;
    plannedDate: Date;
  }[];
  subscribes: Schema.Types.ObjectId[];
}
