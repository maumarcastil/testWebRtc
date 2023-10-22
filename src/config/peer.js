import Peer from "react-native-peerjs";

// create peer connection
export const peerServer = new Peer(undefined, {
  host: "192.168.0.9",
  port: 9000,
  secure: false,
  path: "/peerjs",
});

/* peerServer.on("open", (userId) => {
  console.log("🚀 ~ file: peer.js:13 ~ peer.on ~ userId:", userId);
}); */

peerServer.on("error", (err) => {
  console.log("🚀 ~ file: peer.js:13 ~ peer.on ~ err:", err);
});
