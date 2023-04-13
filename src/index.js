import express from "express";
import HttpStatus from "http-status";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import io from "socket.io";
import { swaggerSpec } from "../swagger";
import dbConnection from "./config/config";
import userRoutes from "./routes/userRouter";
import propertyRoutes from "./routes/propertyRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import reportRoutes from "./routes/reportRoute";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors());

dbConnection();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/reports", reportRoutes);

app.use("/", (req, res) => {
  res.json({
    message: "Welcome to the Nest estate API",
    status: HttpStatus.OK,
  });
});

const PORT = process.env.PORT | 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);
const socketIo = io(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIo.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
  });

  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("typing", isTyping);
  });

  socket.on("stop typing", (isTyping) => {
    socket.broadcast.emit("stop typing", isTyping);
  });

  socket.on("new message", (newMessageReceived) => {
    const { chat } = newMessageReceived;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id !== newMessageReceived.sender._id) {
        socket.in(user._id).emit("message received", newMessageReceived);
      }
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.id);
  });
});

export default app;
