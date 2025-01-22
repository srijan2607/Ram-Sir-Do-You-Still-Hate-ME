const socket = io("/");
const videoGrid = document.getElementById("Video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: 9000,
  debug: 3, // Added debug mode
});

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
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
    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit("message", text.val());
        text.val(" ");
      }
    });

    socket.on("createMessage", (message) => {
      $("ul").append(`<li class = "message"><b>user</b><br/>${message}</li>`);
      scrollToBottom();
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
};

let text = $("input");
console.log(text.val());

const scrollToBottom = () => {
  var d = $(".main_chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

// Mute our video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main_mute_button").innerHTML = html;
};
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main_mute_button").innerHTML = html;
};

// Stop our video
const playStop = () => {
  console.log("object");
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main_video_button").innerHTML = html;
};
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main_video_button").innerHTML = html;
};