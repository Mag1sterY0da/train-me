import { ITrainedModel } from '../interfaces/ITrainedModel.ts';
import { ITrainingType } from '../interfaces/ITrainingType.ts';
import { IUser } from '../interfaces/IUser.ts';
import { IWorkout } from '../interfaces/IWorkoutData.ts';

const API_URL = 'https://train-me-backend.onrender.com/';

export type SignInSignUpResponse = {
  success: boolean;
  user?: IUser;
  error?: string;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<SignInSignUpResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (err) {
    console.log('An error occurred while logging in.');
    return { success: false, error: 'Unknown error occurred' };
  }
};

export const registerUser = async ({
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
}: IUser): Promise<SignInSignUpResponse> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'CS: User was not registered' };
    }
  } catch (err) {
    console.log('An error occurred while registering.');
    return { success: false, error: 'Unknown error occurred' };
  }
};

export const getUser = async (id: string): Promise<SignInSignUpResponse> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (err) {
    console.log('An error occurred while logging in.');
    return { success: false, error: 'Unknown error in the getUser' };
  }
};

type TrainingTypeResponse = {
  success: boolean;
  trainings?: ITrainingType;
  error?: string;
};

export const getTrainingTypesById = async (
  id: string
): Promise<TrainingTypeResponse> => {
  try {
    const response = await fetch(`${API_URL}/trainingTypes/${id}`);

    if (response.ok) {
      const trainingType = await response.json();
      return { success: true, trainings: trainingType };
    } else {
      return { success: false, error: 'Training type not found' };
    }
  } catch (err) {
    console.log('An error occurred while taking a Type.', err);
    return { success: false, error: 'Unknown error in the getTrainingTypes' };
  }
};

type TrainingTypesResponse = {
  success: boolean;
  trainings?: ITrainingType[];
  error?: string;
};

export const getTrainingTypes = async (): Promise<TrainingTypesResponse> => {
  try {
    const response = await fetch(`${API_URL}/trainingTypes`);

    if (response.ok) {
      const trainingTypes = await response.json();
      return { success: true, trainings: trainingTypes };
    } else {
      return { success: false, error: 'Training types not found' };
    }
  } catch (err) {
    console.log('An error occurred while taking a Type.', err);
    return { success: false, error: 'Unknown error in the getTrainingTypes' };
  }
};

type TrainingCompletedResponse = {
  success: boolean;
  error?: string;
};

export const updateTrainingStatus = async (
  userId: string,
  trainingDate: Date,
  completed: boolean
): Promise<TrainingCompletedResponse> => {
  try {
    const response = await fetch(`${API_URL}/updateTraining`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, trainingDate, completed }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'Training was not updated' };
    }
  } catch (err) {
    return {
      success: false,
      error: 'Unknown error in the updateTrainingStatus',
    };
  }
};

type FriendsResponse = {
  success: boolean;
  friends?: IUser[];
  error?: string;
};

export const getFriendsOfUserById = async (
  id: string
): Promise<FriendsResponse> => {
  try {
    const response = await fetch(`${API_URL}/friends/${id}`);

    if (response.ok) {
      const friends = await response.json();
      return { success: true, friends };
    } else {
      return { success: false, error: 'Friend was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getFriendById' };
  }
};

type newFriendsResponse = {
  success: boolean;
  friends?: IUser[];
  error?: string;
};

export const getNewFriendsById = async (
  id: string
): Promise<newFriendsResponse> => {
  try {
    const response = await fetch(`${API_URL}/friends/${id}/new`);

    if (response.ok) {
      const friends = await response.json();
      return { success: true, friends };
    } else {
      return { success: false, error: 'Friend was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getFriendById' };
  }
};

type SubscribeResponse = {
  success: boolean;
  user?: IUser;
  error?: string;
};

export const subscribeToUser = async (
  id: string,
  friendId: string
): Promise<SubscribeResponse> => {
  try {
    const response = await fetch(`${API_URL}/friends/${id}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId }),
    });

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'Friend was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getFriendById' };
  }
};

export const unsubscribeFromUser = async (
  id: string,
  friendId: string
): Promise<SubscribeResponse> => {
  try {
    const response = await fetch(`${API_URL}/friends/${id}/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId }),
    });

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'Friend was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getFriendById' };
  }
};

type WorkoutsResponse = {
  success: boolean;
  workouts?: IWorkout[];
  error?: string;
};

export const getWorkouts = async (): Promise<WorkoutsResponse> => {
  try {
    const response = await fetch(`${API_URL}/workouts`);

    if (response.ok) {
      const workouts = await response.json();
      return { success: true, workouts };
    } else {
      return { success: false, error: 'Workouts was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getWorkouts' };
  }
};

type WorkoutResponse = {
  success: boolean;
  workout?: IWorkout;
  error?: string;
};

export const addWorkout = async (
  workout: IWorkout
): Promise<WorkoutResponse> => {
  try {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gender: workout.gender,
        age: workout.age,
        height: workout.height,
        weight: workout.weight,
        fitnessLevel: workout.fitnessLevel,
        middleRun: workout.middleRun,
        longRun: workout.longRun,
        speedRunDuration: workout.speedRunDuration,
        chillRunDuration: workout.chillRunDuration,
        stretchingDuration: workout.stretchingDuration,
      }),
    });

    if (response.ok) {
      const workout = await response.json();
      return { success: true, workout };
    } else {
      return { success: false, error: 'Friend was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getFriendById' };
  }
};

export const updateUserById = async (
  id: string,
  {
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
  }: IUser
): Promise<SignInSignUpResponse> => {
  try {
    const response = await fetch(`${API_URL}/users/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'CS: User was not registered' };
    }
  } catch (err) {
    console.log('An error occurred while registering.');
    return { success: false, error: 'Unknown error occurred' };
  }
};

type CompletedTrainingResponse = {
  success: boolean;
  user?: IUser;
  error?: string;
};

export const pushCompletedTraining = async (
  userId: string,
  trainingTypeId: string,
  distance?: number,
  duration?: number
): Promise<CompletedTrainingResponse> => {
  try {
    const response = await fetch(`${API_URL}/pushTraining`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, trainingTypeId, distance, duration }),
    });

    if (response.ok) {
      const user = await response.json();
      return { success: true, user };
    } else {
      return { success: false, error: 'Training was not updated' };
    }
  } catch (err) {
    console.log('An error occurred while pushing a training.');
    return { success: false, error: 'Unknown error in the pushTraining' };
  }
};

type ModelResponse = {
  success: boolean;
  model?: ITrainedModel;
  error?: string;
};

export const getModel = async (): Promise<ModelResponse> => {
  try {
    const response = await fetch(`${API_URL}/model`);

    if (response.ok) {
      const model = await response.json();
      return { success: true, model };
    } else {
      return { success: false, error: 'Model was not found' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in getModel' };
  }
};

export const addModel = async (model: string): Promise<ModelResponse> => {
  try {
    const response = await fetch(`${API_URL}/model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
      }),
    });

    if (response.ok) {
      const model = await response.json();
      return { success: true, model };
    } else {
      return { success: false, error: 'Model was not added' };
    }
  } catch (err) {
    return { success: false, error: 'Unknown error in addModel' };
  }
};
