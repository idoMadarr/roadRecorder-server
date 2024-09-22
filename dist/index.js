"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
require("express-async-errors");
const RoadRecord_1 = require("./models/RoadRecord");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/summarize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body.record;
    const deviceId = req.body.deviceId;
    if (!record || !deviceId)
        throw new Error('Missing credentials');
    if (record.length < 2)
        throw new Error('Invalid record length');
    const analyzedRecord = RoadRecord_1.RoadRecord.build(record, deviceId);
    yield analyzedRecord.save();
    return res.status(200).send(analyzedRecord);
}));
app.post('/screen-shot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recordId = req.body.recordId;
    const viewShot = req.body.viewShot;
    if (!recordId || !viewShot)
        throw new Error('Missing credentials');
    const updateRecord = yield RoadRecord_1.RoadRecord.findByIdAndUpdate(recordId, {
        image: viewShot,
    }, { new: true });
    return res.status(200).send(updateRecord);
}));
app.post('/device-records', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.body.deviceId;
    if (!deviceId)
        throw new Error('Missing credentials');
    const deviceRecords = yield RoadRecord_1.RoadRecord.find({ deviceId });
    return res.status(200).send(deviceRecords);
}));
app.all('*', () => {
    throw new Error('Not Found');
});
app.use((error, _req, res, _next) => {
    res.status(400).send({ error: error.message });
});
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
});
initServer();
