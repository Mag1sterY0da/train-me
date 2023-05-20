import { Request, Response } from 'express';
import { handleServerError } from '../errors/serverError.ts';
import User from '../models/User.ts';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findOne({ email, password })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => handleServerError(err, res));
};

export const getUser = async (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => handleServerError(err, res));
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      gender,
      birthDate,
      height,
      weight,
      fitnessLevel,
      avatar,
      nickname,
      completedTrainings,
      plannedTrainings,
      subscribes,
    } = req.body;

    const base64Data = avatar.split(',')[1];

    const newUser = new User({
      email,
      password,
      gender,
      birthDate,
      height,
      weight,
      fitnessLevel,
      avatar: base64Data,
      nickname,
      completedTrainings,
      plannedTrainings,
      subscribes,
    });

    const user = await newUser.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    handleServerError(err as Error, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => handleServerError(err, res));
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const {
      email,
      password,
      gender,
      birthDate,
      height,
      weight,
      fitnessLevel,
      avatar,
      nickname,
      completedTrainings,
      plannedTrainings,
      subscribes,
    } = req.body;

    const base64Data = avatar.split(',')[1];

    const newUser = {
      email,
      password,
      gender,
      birthDate,
      height,
      weight,
      fitnessLevel,
      avatar: base64Data,
      nickname,
      completedTrainings,
      plannedTrainings,
      subscribes,
    };

    //Find the old user and replace it with the new one
    User.findByIdAndUpdate(id, newUser, { new: true }).catch((err) => {
      console.log(err);
    });

    res.json(newUser);
  } catch (err) {
    console.log(err);
    handleServerError(err as Error, res);
  }
};
