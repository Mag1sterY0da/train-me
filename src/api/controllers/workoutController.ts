import { Request, Response } from 'express';
import { handleServerError } from '../errors/serverError.ts';
import Workout from '../models/Workout.ts';

export const getWorkouts = async (_: Request, res: Response) => {
  Workout.find()
    .then((workouts) => {
      res.json(workouts);
    })
    .catch((err) => handleServerError(err, res));
};

export const addWorkout = async (req: Request, res: Response) => {
  const {
    gender,
    age,
    height,
    weight,
    fitnessLevel,
    middleRun,
    longRun,
    speedRunDuration,
    chillRunDuration,
    stretchingDuration,
  } = req.body;

  const newWorkout = new Workout({
    gender,
    age,
    height,
    weight,
    fitnessLevel,
    middleRun,
    longRun,
    speedRunDuration,
    chillRunDuration,
    stretchingDuration,
  });

  try {
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};
