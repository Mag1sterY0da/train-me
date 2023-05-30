import * as tf from '@tensorflow/tfjs';
import React, { useState } from 'react';
import { makePrediction, trainModel } from '../ai/tensor.ts';
import { IUser } from '../interfaces/IUser.ts';
import {
  ModelContext,
  ModelContextProps,
  ModelProviderProps,
} from './useModel.ts';

export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const [model, setModel] = useState<tf.Sequential>(tf.sequential());
  const [trained, setTrained] = useState(false);

  const startTrainOfModel = async () => {
    // const loadedModel = await loadModel();
    // console.log('loadedModel', loadedModel);
    // setModel(loadedModel ?? (await trainModel()));
    setModel(await trainModel());
    setTrained(true);
  };

  const predictWorkouts = async (id: string, user: IUser) => {
    await makePrediction(model, id, user);
  };

  const value: ModelContextProps = {
    model,
    trained,
    startTrainOfModel,
    predictWorkouts,
  };

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
