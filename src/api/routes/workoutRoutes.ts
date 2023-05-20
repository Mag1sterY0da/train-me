import express from 'express';
import { addWorkout, getWorkouts } from '../controllers/workoutController.ts';

export const workoutRoutes = express.Router();

workoutRoutes.get('/workouts', getWorkouts);

workoutRoutes.post('/workouts', addWorkout);

export default workoutRoutes;
