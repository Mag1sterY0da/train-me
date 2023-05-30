import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import friendsRoutes from './routes/friendsRoutes.ts';
import modelRoutes from './routes/modelRoutes.ts';
import trainingRoutes from './routes/trainingRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import workoutRoutes from './routes/workoutRoutes.ts';

dotenv.config();

const { PORT, DB_NAME, DB_USER, PASSWORD } = process.env;
const MONGO_URL = `mongodb+srv://${DB_USER}:${PASSWORD}@cluster0.94h91kq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const app: Application = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(userRoutes);
app.use(friendsRoutes);
app.use(trainingRoutes);
app.use(workoutRoutes);
app.use(modelRoutes);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.listen(PORT, (err?: Error) => {
  err ? console.log(err) : console.log(`Listening on port ${PORT}`);
});
