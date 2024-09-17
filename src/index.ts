import express, { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import 'express-async-errors';
import { GeolocationResponse } from './types/types';
import { RoadRecord } from './models/RoadRecord';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/summarize', async (req, res) => {
  const record: GeolocationResponse[] = req.body.record;
  const deviceId: string = req.body.deviceId;
  if (!record || !deviceId) throw new Error('Missing credentials');

  const analyzedRecord = RoadRecord.build(record, deviceId);
  await analyzedRecord.save();
  return res.status(200).send(analyzedRecord);
});

app.post('/device-records', async (req, res) => {
  const deviceId = req.body.deviceId;
  if (!deviceId) throw new Error('Missing credentials');

  const deviceRecords = await RoadRecord.find({ deviceId });
  return res.status(200).send(deviceRecords);
});

app.all('*', () => {
  throw new Error('Not Found');
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ error: error.message });
});

const initServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

initServer();
