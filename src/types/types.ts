import { Document, Model } from 'mongoose';

export interface GeolocationResponse {
  timestamp: number;
  coords: {
    speed: number;
    heading: number;
    altitude: number;
    accuracy: number;
    longitude: number;
    latitude: number;
  };
  extras: {
    meanCn0: number;
    maxCn0: number;
    satellites: number;
  };
}

export interface RoadRecordType extends Document {
  userId: string;
  distance: number;
  averageSpeed: number;
  startTime: Date;
  endTime: Date;
  wayponits: Waypoint[];
}

export interface RoadRecordModel extends Model<RoadRecordType> {
  build(record: GeolocationResponse[], userId: string): RoadRecordType;
}

export interface Waypoint {
  longitude: number;
  latitude: number;
}
