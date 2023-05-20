export interface IWorkout {
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
