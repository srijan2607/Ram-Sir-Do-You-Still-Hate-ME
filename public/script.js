const socket = io("/");
const videoGrid = document.getElementById("Video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;

    addVideoStream(myVideo, stream);

    socket.on("user-connected", (userId) => {
      console.log("User connected:", userId);
    });
  })
  .catch((err) => {
    console.error("Error accessing media devices:", err);
  });

socket.emit("join-room", roomId);

socket.on("user-connected", () => {
  connectToNewUser();
});

const connectToNewUser = () => {
  console.log("New User");
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
