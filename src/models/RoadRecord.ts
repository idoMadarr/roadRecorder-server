import { Schema, model } from 'mongoose';
import {
  GeolocationResponse,
  RoadRecordModel,
  RoadRecordType,
} from '../types/types';
import { analyzeRoadRecord } from '../utils/haversineFormula';

const roadRecordSchema = new Schema(
  {
    deviceId: {
      type: String,
      require: true,
    },
    distance: {
      type: Number,
      require: true,
      default: 0,
    },
    averageSpeed: {
      type: Number,
      require: true,
    },
    startTime: {
      type: Date,
      require: true,
    },
    endTime: {
      type: Date,
      default: new Date(),
    },
    waypoints: {
      type: [
        {
          _id: false,
          longitude: {
            type: Number,
            required: true,
          },
          latitude: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

roadRecordSchema.statics.build = (
  record: GeolocationResponse[],
  deviceId: string
): RoadRecordType => {
  const { distance, averageSpeed, startTime, waypoints } =
    analyzeRoadRecord(record);

  return new RoadRecord({
    deviceId,
    distance,
    averageSpeed,
    startTime,
    waypoints,
  });
};

export const RoadRecord = model<RoadRecordType, RoadRecordModel>(
  'Record',
  roadRecordSchema
);
