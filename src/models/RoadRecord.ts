import { Schema, model } from 'mongoose';
import {
  GeolocationResponse,
  RoadRecordModel,
  RoadRecordType,
} from '../types/types';
import { analyzeRoadRecord } from '../utils/haversineFormula';

const roadRecordSchema = new Schema(
  {
    userId: {
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
  userId: string
): RoadRecordType => {
  const startTime = new Date(record[0].timestamp);
  const { distance, averageSpeed, waypoints } = analyzeRoadRecord(record);

  return new RoadRecord({
    userId,
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
