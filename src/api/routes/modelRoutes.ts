import express from 'express';
import { addModel, getModel } from '../controllers/modelController.ts';

export const modelRoutes = express.Router();

modelRoutes.get('/model', getModel);

modelRoutes.post('/model', addModel);

export default modelRoutes;
