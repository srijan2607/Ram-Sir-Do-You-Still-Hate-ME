
// App.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use("/peerjs", peerServer);

// Routes
app.get("/", (req, res) => {
  res.redirect(`/${uuid()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});
const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
