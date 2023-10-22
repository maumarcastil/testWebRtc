import socketIOClient from "socket.io-client";

export const WS = "http://192.168.0.9:5000";
// export const WS = "https://ws.webrtctest.online";
export const ws = socketIOClient(WS, {
  forceNew: true,
});

ws.on("connect", () => {
  console.log("🚀 ~ [SOCKET] ws connected");
});

// handle error
ws.on("connect_error", (err) => {
  console.log("🚀 ~ file: ws.js:12 ~ ws.on ~ err:", err);
});
