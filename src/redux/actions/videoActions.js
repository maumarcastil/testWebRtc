import { setMyStream } from "../slices/videoSlice";

export const joinRoom = (stream) => async (dispatch) => {
  const roomId = "sdnmaiofjasoifajionuighbyufgvtyczxm";

  // save my stream to redux
  dispatch(setMyStream(stream));
};

// /* API_URL */
// export const API_URL = "http://192.168.0.9:5000";
//
// // socket config
// export const socket = io(API_URL);
// socket.on("connect", () => {
//   console.log("🚀 ~ [SOCKET]: connected client to server");
// });
//
// socket.on("disconnect", () => {
//   console.log("🚀 ~ [SOCKET]: Connection to server lost. Reconnecting...");
// });

// export const joinRoom = (stream) => async (dispatch) => {
//   const roomId = "sdnmaiofjasoifajionuighbyufgvtyczxm";
//
//   // save my stream to redux
//   dispatch(setMyStream(stream));

// /* peer config */
// const peerServer = new Peer(stream, {
//   host: "192.168.0.9",
//   port: 5000,
//   secure: false,
//   path: "/peerjs",
// });
//
// peerServer.on("error", (err) => {
//   console.log("🚀 ~ file: videoActions.js:27 ~ peerServer.on ~ err:", err);
// });
//
// // open a connection to our server
// peerServer.on("open", (userId) => {
//   console.log(
//     "🚀 ~ file: videoActions.js:46 ~ peerServer.on ~ peerServer.on(open)"
//   );
//   socket.emit("join-room", { roomId, userId });
// });
//
// socket.on("user-connected", (userId) => {
//   connectToNewUser(userId, stream, dispatch);
//   console.log(
//     "🚀 ~ file: videoActions.js:44 ~ socket.on ~ user-connected (userId):",
//     userId
//   );
// });
//
// peerServer.on("call", (call) => {
//   console.log("🚀 ~ file: videoActions.js:54 ~ peerServer.on ~ call:", call);
//   call.answer(stream);
//   call.on("stream", (stream) => {
//     console.log("🚀 ~ file: videoActions.js:54 ~ call.on ~ stream:", stream);
//     dispatch(setStreams(stream));
//   });
// };

// function connectToNewUser(userId, stream, dispatch) {
//   const call = peerServer.call(userId, stream);
//
//   call.on("stream", (remoteVideoStream) => {
//     if (remoteVideoStream) {
//       dispatch(setStreams(remoteVideoStream));
//     }
//   });
// }
// };
