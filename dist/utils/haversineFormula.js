"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRoadRecord = void 0;
const haversineFormula = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};
const toRad = (value) => {
    return (value * Math.PI) / 180;
};
const calculateTotalDistance = (coordinates) => {
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const start = coordinates[i].coords;
        const end = coordinates[i + 1].coords;
        const distance = haversineFormula(start.latitude, start.longitude, end.latitude, end.longitude);
        totalDistance += distance;
    }
    return totalDistance;
};
const calculateAverageSpeed = (coordinates) => {
    let totalDistance = 0; // in kilometers
    let totalTime = 0; // in hours
    for (let i = 1; i < coordinates.length; i++) {
        const prevPoint = coordinates[i - 1];
        const currentPoint = coordinates[i];
        const distance = haversineFormula(prevPoint.coords.latitude, prevPoint.coords.longitude, currentPoint.coords.latitude, currentPoint.coords.longitude);
        // Convert timestamp from milliseconds to hours
        const timeElapsed = (currentPoint.timestamp - prevPoint.timestamp) / (1000 * 60 * 60); // Convert ms to hours
        totalDistance += distance;
        totalTime += timeElapsed;
    }
    const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0; // in km/h
    return averageSpeed;
};
const buildDirectionWaypoints = (path) => {
    const waypoints = path.map(point => {
        return {
            latitude: point.coords.latitude,
            longitude: point.coords.longitude,
        };
    });
    return waypoints;
};
const analyzeRoadRecord = (record) => {
    return {
        distance: calculateTotalDistance(record),
        averageSpeed: calculateAverageSpeed(record),
        waypoints: buildDirectionWaypoints(record),
        startTime: new Date(record[0].timestamp),
    };
};
exports.analyzeRoadRecord = analyzeRoadRecord;
