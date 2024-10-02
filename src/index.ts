import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import * as dotenv from 'dotenv';
import 'express-async-errors';
import { GeolocationResponse } from './types/types';
import { RoadRecord } from './models/RoadRecord';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serving 'policy' folder as a static route
app.use(express.static(path.join(__dirname, 'policy')));

app.get('/privacy-policy', (_req, res) => {
  const policyFile = path.join(__dirname, 'policy', 'privacy-policy.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(policyFile);
});

app.post('/summarize', async (req, res) => {
  const record: GeolocationResponse[] = req.body.record;
  const deviceId: string = req.body.deviceId;
  if (!record || !deviceId) throw new Error('Missing credentials');
  if (record.length < 2) throw new Error('Invalid record length');

  const analyzedRecord = RoadRecord.build(record, deviceId);
  await analyzedRecord.save();
  return res.status(200).send(analyzedRecord);
});

app.post('/screen-shot', async (req, res) => {
  const recordId = req.body.recordId;
  const viewShot = req.body.viewShot;
  if (!recordId || !viewShot) throw new Error('Missing credentials');

  const updateRecord = await RoadRecord.findByIdAndUpdate(
    recordId,
    {
      image: viewShot,
    },
    { new: true }
  );
  return res.status(200).send(updateRecord);
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
