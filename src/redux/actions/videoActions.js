import { io } from "socket.io-client";
import Peer from "react-native-peerjs";

import { setMyStream, setStreams } from "../slices/videoSlice";
import { customGenerationFunction } from "../../utils/generators";

/* API_URL */
export const API_URL = "http://192.168.0.9:5000";

// socket config
export const socket = io(API_URL);
socket.on("connect", () => {
  console.log("connected client to server");
});

socket.on("connection", () => {
  console.log("connected client to server");
});

socket.on("disconnect", () => {
  console.log("Connection to server lost. Reconnecting...");
});

/* peer config */
const peerServer = new Peer(customGenerationFunction(), {
  host: "peer-qvf4.onrender.com",
  port: 443,
  secure: false,
  path: "/",
});

peerServer.on("error", (err) => {
  console.log("🚀 ~ file: videoActions.js:27 ~ peerServer.on ~ err:", err);
});

peerServer.on("connection", (client) => {
  console.log(
    "🚀 ~ file: videoActions.js:34 ~ peerServer.on ~ client:",
    client
  );
});

peerServer.on("disconnect", (client) => {
  console.log(
    "🚀 ~ file: videoActions.js:34 ~ peerServer.on ~ client:",
    client
  );
});

export const joinRoom = (stream) => async (dispatch) => {
  const roomId = "sdnmaiofjasoifajionuighbyufgvtyczxm";

  // save my stream to redux
  dispatch(setMyStream(stream));

  // open a connection to our server
  peerServer.on("open", (userId) => {
    console.log(
      "🚀 ~ file: videoActions.js:45 ~ peerServer.on ~ userId:",
      userId
    );
    socket.emit("join-room", { roomId, userId });
  });

  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream, dispatch);
    console.log(
      "🚀 ~ file: videoActions.js:44 ~ socket.on ~ user-connected (userId):",
      userId
    );
  });

  peerServer.on("call", (call) => {
    console.log("🚀 ~ file: videoActions.js:54 ~ peerServer.on ~ call:", call);
    call.answer(stream);
    call.on("stream", (stream) => {
      console.log("🚀 ~ file: videoActions.js:54 ~ call.on ~ stream:", stream);
      dispatch(setStreams(stream));
    });
  });
};

export const connectToNewUser = (userId, stream, dispatch) => {
  const call = peerServer.call(userId, stream);

  call.on("stream", (remoteVideoStream) => {
    if (remoteVideoStream) {
      dispatch(setStreams(remoteVideoStream));
    }
  });
};
