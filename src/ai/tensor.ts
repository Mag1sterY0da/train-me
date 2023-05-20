import * as tf from '@tensorflow/tfjs';
import {
  addWorkout,
  getTrainingTypes,
  getWorkouts,
  updateUserById,
} from '../api/client.ts';
import { IUser } from '../interfaces/IUser.ts';

tf.setBackend('cpu');

interface TrainingData {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  fitnessLevel: 'minimum' | 'beginner' | 'moderate' | 'high' | 'extreme';
  middleRun: number;
  longRun: number;
  speedRunDuration: number;
  chillRunDuration: number;
  stretchingDuration: number;
}

const applyCoef = (data: TrainingData): number[] => {
  const getAgeCoefficient = (age: number, gender: string): number => {
    if (age === 10) return gender === 'male' ? 1000 : 900;
    if (age === 11) return gender === 'male' ? 1100 : 1000;
    if (age === 12) return gender === 'male' ? 1200 : 1000;
    if (age === 13 || age === 14) return gender === 'male' ? 1500 : 1000;
    if (age === 15 || age === 16) return gender === 'male' ? 2000 : 1500;
    if (age >= 17 && age <= 40) return gender === 'male' ? 3000 : 2000;
    if (age >= 40) return gender === 'male' ? 2000 : 1800;
    return gender === 'male' ? 1000 : 800;
  };

  const getBMICoefficient = (height: number, weight: number): number => {
    const BMI = weight / ((height / 100) * (height / 100));
    if (BMI < 16) return 0.7;
    if (BMI >= 16 && BMI < 18.5) return 0.8;
    if (BMI >= 18.5 && BMI < 25) return 1;
    if (BMI >= 25 && BMI < 30) return 0.8;
    if (BMI >= 30) return 0.7;
    return 0.5;
  };

  const getFitnessCoefficient = (fitnessLevel: string): number => {
    if (fitnessLevel === 'extreme') return 2;
    if (fitnessLevel === 'high') return 1.5;
    if (fitnessLevel === 'moderate') return 1.25;
    if (fitnessLevel === 'beginner') return 1;
    return 0.8;
  };

  const genderCoefficient = data.gender === 'male' ? 1 : 0.9;
  const ageCoefficient = getAgeCoefficient(data.age, data.gender);
  const imbCoefficient = getBMICoefficient(data.height, data.weight);
  const fitnessCoefficient = getFitnessCoefficient(data.fitnessLevel);

  const coef =
    genderCoefficient * ageCoefficient * imbCoefficient * fitnessCoefficient;

  return [coef];
};

export const makePrediction = async (
  model: tf.Sequential,
  id: string,
  user: IUser
): Promise<void> => {
  const userAge =
    new Date().getFullYear() - new Date(user.birthDate).getFullYear();
  const predictedWorkout = {
    gender: user.gender,
    age: userAge,
    height: user.height,
    weight: user.weight,
    fitnessLevel: user.fitnessLevel,
    middleRun: 0,
    longRun: 0,
    speedRunDuration: 0,
    chillRunDuration: 0,
    stretchingDuration: 0,
  };

  const trainingTypes = await (await getTrainingTypes()).trainings;

  if (!trainingTypes) throw new Error('No training types found');

  const testFeatures = tf.tensor2d([applyCoef(predictedWorkout)], [1, 1]);
  const predictions = model.predict(testFeatures) as tf.Tensor;

  const predictedValues = predictions.dataSync();

  predictedWorkout.middleRun = Math.floor(predictedValues[0] / 100) * 100;
  predictedWorkout.longRun = Math.floor(predictedValues[1] / 100) * 100;
  predictedWorkout.speedRunDuration = Math.floor(predictedValues[2]);
  predictedWorkout.chillRunDuration = Math.floor(predictedValues[3]);
  predictedWorkout.stretchingDuration = Math.floor(predictedValues[4]);

  await addWorkout(predictedWorkout);

  const longRunId = trainingTypes?.find(
    (training) => training.type === 'Long run'
  )?._id;
  const middleRunId = trainingTypes?.find(
    (training) => training.type === 'Middle run'
  )?._id;
  const speedRunId = trainingTypes?.find(
    (training) => training.type === 'Speed run'
  )?._id;
  const chillRunId = trainingTypes?.find(
    (training) => training.type === 'Chill run'
  )?._id;
  const stretchingId = trainingTypes?.find(
    (training) => training.type === 'Stretching'
  )?._id;

  if (
    !longRunId ||
    !middleRunId ||
    !speedRunId ||
    !chillRunId ||
    !stretchingId
  ) {
    throw new Error('No training types found');
  }
  const currentDate = new Date();

  const setTimeToMidday = (date: Date): Date => {
    date.setHours(12, 0, 0, 0);
    return date;
  };

  const middleRun = {
    type: middleRunId,
    distance: predictedWorkout.middleRun,
    date: setTimeToMidday(
      new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000)
    ),
    completed: false,
  };

  const speedRun = {
    type: speedRunId,
    duration: predictedWorkout.speedRunDuration,
    date: setTimeToMidday(
      new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000)
    ), // 2-day gap
    completed: false,
  };

  const longRun = {
    type: longRunId,
    distance: predictedWorkout.longRun,
    date: setTimeToMidday(
      new Date(speedRun.date.getTime() + 2 * 24 * 60 * 60 * 1000)
    ), // 2-day gap
    completed: false,
  };

  const chillRun = {
    type: chillRunId,
    duration: predictedWorkout.chillRunDuration,
    date: setTimeToMidday(
      new Date(longRun.date.getTime() + 1 * 24 * 60 * 60 * 1000)
    ), // 1-day gap
    completed: false,
  };

  const stretching = {
    type: stretchingId,
    duration: predictedWorkout.stretchingDuration,
    date: setTimeToMidday(
      new Date(chillRun.date.getTime() + 1 * 24 * 60 * 60 * 1000)
    ), // 1-day gap
    completed: false,
  };

  const newUser = {
    ...user,
    height: predictedWorkout.height,
    weight: predictedWorkout.weight,
    fitnessLevel: predictedWorkout.fitnessLevel,
    plannedTrainings: [middleRun, speedRun, longRun, chillRun, stretching],
  };

  await updateUserById(id, newUser);
};

export const trainModel = async () => {
  const trainingData = (await getWorkouts()).workouts;

  if (!trainingData) throw new Error('No training data found');

  const trainingFeatures: number[][] = trainingData.map((data) =>
    applyCoef(data)
  );

  const trainingLabels: number[][] = trainingData.map((data) => [
    data.middleRun,
    data.longRun,
    data.speedRunDuration,
    data.chillRunDuration,
    data.stretchingDuration,
  ]);

  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 16,
      inputShape: [1],
      activation: 'relu',
    })
  );
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 5, activation: 'linear' }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  const epochs = 50;
  const batchSize = 4;
  await model.fit(
    tf.tensor2d(trainingFeatures, [trainingFeatures.length, 1]),
    tf.tensor2d(trainingLabels, [trainingLabels.length, 5]),
    {
      epochs,
      batchSize,
    }
  );

  return model;
};

// export const runPrediction = async (user: IUser): Promise<void> => {
//   const model = await trainModel();
//   await makePrediction(model, user);
// };
