// import socket connection and peer connection
import { ws } from "../config/ws";
/* import { peerServer } from "../config/peer"; */
import Peer from "react-native-peerjs";

export class StreamingService {
  peerServer;

  constructor() {
    this.roomId = "123456789";
    this.ws = ws;
    this.peerServer = new Peer(undefined, {
      host: "192.168.0.9",
      port: 9000,
      secure: false,
      path: "/peerjs",
    });
  }

  //intialize
  initialize() {}

  createRoom(token) {
    this.ws.emit("create-room", { token });
  }

  joinRoom(stream) {
    this.peerServer.on("error", (err) => {
      console.log(
        "🚀 ~ file: streamingService.js:38 ~ StreamingService ~ joinRoom ~ err:",
        err
      );
    });

    // open a connection to our server
    this.peerServer.on("open", (userId) => {
      console.log(
        "🚀 ~ file: streamingService.js:22 ~ StreamingService ~ this.peerServer.on ~ userId:",
        userId
      );
      this.emit("join-room", { userId, roomId: this.roomId });
    });

    this.on("user-connected", (userId) => {
      console.log(
        "🚀 ~ file: streamingService.js:29 ~ StreamingService ~ this.on ~ userId",
        userId
      );
      this.connectToNewUser(userId, stream);
    });

    this.onPeer("call", (call) => {
      console.log(
        "🚀 ~ file: streamingService.js:40 ~ StreamingService ~ this.onPeer ~ call:",
        call
      );
      console.log(
        "🚀 ~ file: streamingService.js:51 ~ StreamingService ~ this.onPeer ~ stream:",
        stream
      );
      call.answer(stream);
      call.on("stream", (stream) => {
        console.log(
          "🚀 ~ file: streamingService.js:57 ~ StreamingService ~ call.on ~ stream:",
          stream
        );
      });
    });
  }

  leaveRoom() {
    this.ws.emit("leave-room");
  }

  on(event, callback) {
    this.ws.on(event, callback);
  }

  off(event, callback) {
    this.ws.off(event, callback);
  }

  emit(event, data) {
    this.ws.emit(event, data);
  }

  // peerjs
  onPeer(event, callback) {
    this.peerServer.on(event, callback);
  }

  offPeer(event, callback) {
    this.peerServer.off(event, callback);
  }

  callPeer(id, stream) {
    return this.peerServer.call(id, stream);
  }

  answerPeer(call, stream) {
    call.answer(stream);
  }

  disconnectPeer() {
    this.peerServer.disconnect();
  }

  connectToNewUser(userId, stream) {
    console.log(
      "🚀 ~ file: streamingService.js:98 ~ StreamingService ~ connectToNewUser ~ connectToNewUser:"
    );
    this.callPeer(userId, stream);
  }
}
