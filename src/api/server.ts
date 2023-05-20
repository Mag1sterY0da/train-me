import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import friendsRoutes from './routes/friendsRoutes.ts';
import trainingRoutes from './routes/trainingRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import workoutRoutes from './routes/workoutRoutes.ts';

const PORT = 3000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/train-me';

const app: Application = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(userRoutes);
app.use(friendsRoutes);
app.use(trainingRoutes);
app.use(workoutRoutes);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.listen(PORT, (err?: Error) => {
  err ? console.log(err) : console.log(`Listening on port ${PORT}`);
});
