const socket = io("http://localhost:9000");
const videoGrid = document.getElementById("Video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "localhost",
  port: 9000,
  debug: 3, // Added debug mode
});

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    console.log("Got local stream");
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (uservideoStream) => {
        console.log("Received stream from call");
        addVideoStream(video, uservideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("New user connected:", userId);
      connectToNewUser(userId, stream);
    });
  });

peer.on("open", (id) => {
  console.log("My peer ID:", id);
  socket.emit("join-room", ROOM_ID, id);
});

peer.on("error", (err) => {
  console.error("PeerJS error:", err);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (uservideoStream) => {
    addVideoStream(video, uservideoStream);
  });
  call.on("error", (err) => {
    console.error("Call error:", err);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
  console.log("Added video stream to grid");
};
