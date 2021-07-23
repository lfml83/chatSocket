import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";

const app = express();

const server = createServer(app); // para utilizar o socket e o express

mongoose.connect("mongodb://localhost/chatSocket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, "..", "public")));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Socket", socket.id);
});

app.get("/", (request, response) => {
  return response.json({
    message: "Hello Websocket",
  });
});

export { server, io };
