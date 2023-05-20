import express from 'express';
import {
  getTrainingTypeById,
  getTrainingTypes,
  pushCompletedTraining,
  updateTrainingCompleted,
} from '../controllers/trainingController.ts';

export const trainingRoutes = express.Router();

trainingRoutes.get('/trainingTypes/:id', getTrainingTypeById);

trainingRoutes.post('/updateTraining', updateTrainingCompleted);

trainingRoutes.get('/trainingTypes', getTrainingTypes);

trainingRoutes.post('/pushTraining', pushCompletedTraining);

export default trainingRoutes;
