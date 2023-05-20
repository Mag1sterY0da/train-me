import * as tf from '@tensorflow/tfjs';
import { createContext, useContext } from 'react';
import { IUser } from '../interfaces/IUser.ts';

export interface ModelContextProps {
  model: tf.Sequential;
  trained: boolean;
  startTrainOfModel: () => Promise<void>;
  predictWorkouts: (id: string, user: IUser) => Promise<void>;
}

export const ModelContext = createContext<ModelContextProps | undefined>(
  undefined
);

export const useModel = (): ModelContextProps => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export interface ModelProviderProps {
  children: React.ReactNode;
}
