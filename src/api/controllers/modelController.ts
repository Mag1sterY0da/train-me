import { Request, Response } from 'express';
import { handleServerError } from '../errors/serverError.ts';
import TrainedModel from '../models/TrainedModel.ts';

export const getModel = async (_: Request, res: Response) => {
  TrainedModel.findOne()
    .then((model) => {
      res.json(model);
    })
    .catch((err) => handleServerError(err, res));
};

export const updateModel = async (req: Request, res: Response) => {
  const { model } = req.body;

  TrainedModel.findOneAndReplace({}, { model })
    .then((trainedModel) => {
      res.json(trainedModel);
    })
    .catch((err) => handleServerError(err, res));
};

export const addModel = async (req: Request, res: Response) => {
  const { model } = req.body;

  const newModel = new TrainedModel({
    model,
  });

  try {
    const trainedModel = await newModel.save();
    res.json(trainedModel);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};
