// src/index.ts

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Real-Time Location Tracking Server");
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; adjust in production
    methods: ["GET", "POST"],
  },
});

// Store user data
interface User {
  id: string;
  username: string;
  latitude: number;
  longitude: number;
  rideCoords: Rides | null;
  avatar: string;
}

interface Rides {
  coordinates: [number, number];
}

const users: { [key: string]: User } = {};

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining with info
  socket.on(
    "join",
    (data: {
      id: string;
      username: string;
      latitude: number;
      longitude: number;
      rideCoords: Rides | null;
      avatar: string;
    }) => {
      const { id, username, latitude, longitude, rideCoords, avatar } = data;
      users[id] = { id, username, latitude, longitude, rideCoords, avatar };
      socket.data.id = id; // Store user ID in socket data
      console.log(`User joined: ${username} (${id})`);
      console.log("Ride coordinates:", rideCoords);
      // Broadcast updated users and ride coordinates to all clients
      io.emit("users", Object.values(users));
      io.emit("rideCoords", rideCoords);
    }
  );

  // Handle location updates
  socket.on(
    "locationUpdate",
    (data: { id: string; latitude: number; longitude: number }) => {
      const { id, latitude, longitude } = data;
      if (users[id]) {
        users[id].latitude = latitude;
        users[id].longitude = longitude;
        // Broadcast updated users to all clients
        io.emit("users", Object.values(users));
      }
    }
  );

  // Handle disconnection
  socket.on("disconnect", () => {
    const id = socket.data.id;
    if (id && users[id]) {
      console.log(`User disconnected: ${users[id].username} (${id})`);
      delete users[id];
      // Broadcast updated users to all clients
      io.emit("users", Object.values(users));
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
