import express from 'express';
import {
  getFriendOfUserById,
  getNewFriendsById,
  subscribeToUser,
  unsubscribeFromUser,
} from '../controllers/friendsController.ts';

export const friendsRoutes = express.Router();

friendsRoutes.get('/friends/:id', getFriendOfUserById);

friendsRoutes.get('/friends/:id/new', getNewFriendsById);

friendsRoutes.post('/friends/:id/subscribe', subscribeToUser);

friendsRoutes.post('/friends/:id/unsubscribe', unsubscribeFromUser);

export default friendsRoutes;
