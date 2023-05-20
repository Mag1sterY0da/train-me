import mongoose from 'mongoose';
import { IWorkout } from '../../interfaces/IWorkoutData.ts';

const workoutSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  age: {
    type: Number,
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
  middleRun: {
    type: Number,
    required: true,
  },
  longRun: {
    type: Number,
    required: true,
  },
  speedRunDuration: {
    type: Number,
    required: true,
  },
  chillRunDuration: {
    type: Number,
    required: true,
  },
  stretchingDuration: {
    type: Number,
    required: true,
  },
});

const Workout = mongoose.model<IWorkout>('workout', workoutSchema, 'workouts');

export default Workout;
