import { Request, Response } from 'express';
import { handleServerError } from '../errors/serverError.ts';
import User from '../models/User.ts';

export const getFriendOfUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('subscribes');
    if (!user) {
      throw new Error('User not found');
    }

    const friends = await User.find({
      _id: { $in: user.subscribes },
    }).select('_id avatar nickname');

    res.json(friends);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};

export const getFriendById = async (req: Request, res: Response) => {
  User.findById(req.params.id)
    .select('avatar nickname completedTrainings')
    .then((user) => {
      res.json(user);
    })
    .catch((err) => handleServerError(err, res));
};

export const getNewFriendsById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('subscribes');
    if (!user) {
      throw new Error('User not found');
    }

    const allUsers = await User.find().select('_id avatar nickname');
    const subscribedFriends = user.subscribes || [];

    const newFriends = allUsers.filter(
      (friend) =>
        !subscribedFriends.includes(friend._id) &&
        friend._id.toString() !== userId
    );

    res.json(newFriends);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};

export const subscribeToUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const friendId = req.body.friendId;

  try {
    const user = await User.findById(userId).select('subscribes');
    if (!user) {
      throw new Error('User not found');
    }

    const friend = await User.findById(friendId).select('_id');
    if (!friend) {
      throw new Error('Friend not found');
    }

    user.subscribes.push(friendId);
    await user.save();

    res.json(user);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};

export const unsubscribeFromUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const friendId = req.body.friendId;

  try {
    const user = await User.findById(userId).select('subscribes');
    if (!user) {
      throw new Error('User not found');
    }

    const friend = await User.findById(friendId).select('_id');
    if (!friend) {
      throw new Error('Friend not found');
    }

    user.subscribes = user.subscribes.filter(
      (friend) => friend.toString() !== friendId
    );

    await user.save();

    res.json(user);
  } catch (err) {
    handleServerError(err as Error, res);
  }
};
