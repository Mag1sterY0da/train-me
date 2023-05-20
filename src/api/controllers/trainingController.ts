import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { handleServerError } from '../errors/serverError.ts';
import TrainingType from '../models/TrainingType.ts';
import User from '../models/User.ts';

export const getTrainingTypeById = async (req: Request, res: Response) => {
  TrainingType.findById(req.params.id)
    .then((trainingType) => {
      res.json(trainingType);
    })
    .catch((err) => handleServerError(err, res));
};

export const getTrainingTypes = async (_: Request, res: Response) => {
  TrainingType.find()
    .then((trainingTypes) => {
      res.json(trainingTypes);
    })
    .catch((err) => handleServerError(err, res));
};

export const updateTrainingCompleted = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const dateString = req.body.trainingDate;
  const completed = req.body.completed;

  try {
    const user = await User.findOne({
      _id: userId,
      'plannedTrainings.date': dateString,
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const date = new Date(dateString);

    const plannedTraining = user.plannedTrainings.find(
      (training) => training.date.getTime() === date.getTime()
    );

    if (!plannedTraining)
      return res.status(404).json({ error: 'PlannedTraining not found.' });

    plannedTraining.completed = completed;

    if (!completed) {
      user.completedTrainings = user.completedTrainings.filter(
        (training) => training.plannedDate.getTime() !== date.getTime()
      );
    } else {
      const completedTraining = {
        type: plannedTraining.type,
        distance: plannedTraining.distance,
        duration: plannedTraining.duration,
        plannedDate: plannedTraining.date,
        date: new Date(),
      };

      user.completedTrainings.push(completedTraining);
    }

    await user.save();

    res.json(user);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};

export const pushCompletedTraining = async (req: Request, res: Response) => {
  const { userId, trainingTypeId, distance, duration } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');

    const typeOfTraining = await TrainingType.findById(trainingTypeId);
    if (!typeOfTraining) throw new Error('TrainingType not found.');

    const completedTraining: {
      type: Schema.Types.ObjectId;
      distance?: number;
      duration?: number;
      date: Date;
      plannedDate: Date;
    } = {
      type: trainingTypeId,
      date: new Date(),
      plannedDate: new Date(),
    };

    if (
      typeOfTraining.type === 'Long run' ||
      typeOfTraining.type === 'Middle run'
    ) {
      completedTraining.distance = Math.floor(distance);
      if (user.plannedTrainings.length > 0) {
        const plannedTraining = user.plannedTrainings.find(
          (training) => training.type.toString() === trainingTypeId
        );
        if (plannedTraining && plannedTraining.distance) {
          if (plannedTraining.distance < distance) {
            plannedTraining.completed = true;

            const training = {
              type: completedTraining.type,
              distance: completedTraining.distance,
              plannedDate: completedTraining.date,
              date: new Date(),
            };

            user.completedTrainings.push(training);
          } else {
            user.completedTrainings.push(completedTraining);
          }
        }
      } else {
        user.completedTrainings.push(completedTraining);
      }
    } else {
      completedTraining.duration = Math.floor(duration);
      if (user.plannedTrainings.length > 0) {
        const plannedTraining = user.plannedTrainings.find(
          (training) => training.type.toString() === trainingTypeId
        );
        if (plannedTraining && plannedTraining.duration) {
          if (plannedTraining.duration < duration) {
            plannedTraining.completed = true;

            const training = {
              type: completedTraining.type,
              duration: completedTraining.duration,
              plannedDate: completedTraining.date,
              date: new Date(),
            };

            user.completedTrainings.push(training);
          } else {
            user.completedTrainings.push(completedTraining);
          }
        }
      } else {
        user.completedTrainings.push(completedTraining);
      }
    }

    const newUser = await user.save();

    res.json(newUser);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};
