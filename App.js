const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.redirect(`/${uuid()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected");
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
