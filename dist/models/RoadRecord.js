"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadRecord = void 0;
const mongoose_1 = require("mongoose");
const haversineFormula_1 = require("../utils/haversineFormula");
const roadRecordSchema = new mongoose_1.Schema({
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
        require: true,
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
    image: {
        type: String,
        default: null,
    },
}, {
    versionKey: false,
});
roadRecordSchema.statics.build = (record, deviceId) => {
    const { distance, averageSpeed, startTime, endTime, waypoints } = (0, haversineFormula_1.analyzeRoadRecord)(record);
    return new exports.RoadRecord({
        deviceId,
        distance,
        averageSpeed,
        startTime,
        endTime,
        waypoints,
    });
};
exports.RoadRecord = (0, mongoose_1.model)('Record', roadRecordSchema);
