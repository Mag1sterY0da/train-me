import { Response } from 'express';

export const handleServerError = (err: Error, res: Response) => {
  res.status(500).json({ error: err.message });
};
