import mongoose, { Schema } from 'mongoose';
import { IUser } from '../../interfaces/IUser.ts';

const userSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  fitnessLevel: {
    type: String,
    enum: ['minimum', 'beginner', 'moderate', 'high', 'extreme'],
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  nickname: {
    type: String,
    required: true,
  },
  plannedTrainings: [
    {
      type: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      distance: {
        type: Number,
        required: false,
      },
      duration: {
        type: Number,
        required: false,
      },
      date: {
        type: Date,
        required: true,
      },
      completed: {
        type: Boolean,
        required: true,
      },
    },
  ],
  completedTrainings: [
    {
      type: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      distance: {
        type: Number,
        required: false,
      },
      duration: {
        type: Number,
        required: false,
      },
      date: {
        type: Date,
        required: true,
      },
      plannedDate: {
        type: Date,
        required: true,
      },
    },
  ],
  subscribes: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;
