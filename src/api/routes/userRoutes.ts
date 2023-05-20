import express from 'express';
import {
  getUserById,
  loginUser,
  registerUser,
  updateUserById,
} from '../controllers/userController.ts';

export const userRoutes = express.Router();

userRoutes.post('/login', loginUser);

userRoutes.post('/register', registerUser);

userRoutes.get('/users/:id', getUserById);

userRoutes.post('/users/update/:id', updateUserById);

export default userRoutes;
