import Peer from "react-native-peerjs";
import { mediaDevices } from "react-native-webrtc";
import { useDispatch, useSelector } from "react-redux";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ws } from "../config/ws";
import {
  addAllPeers,
  addPeerName,
  addPeerStream,
  removePeerStream,
} from "../redux/slices/peerSlice";
import { customGenerationFunction } from "../utils/generators";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJNenVPakc5VWgxZjVDVzl1ZG1Sb0dDaUZaeDEzIiwiZW1haWwiOiJjYXBveWFzNjEyQHN0eXBlZGlhLmNvbSIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE2OTc4MTM5ODMsImV4cCI6MjAxMzM4OTk4M30.O2kz-Tam_K6h08GuQLndMy8ySvRtbsflmUC-1Kh_TDw"
  );

  /* redux */
  const dispatch = useDispatch();
  const state = useSelector((state) => state.peerReducer);
  console.log("🚀 ~ file: RoomContext.jsx:30 ~ RoomProvider ~ state:", state);

  useEffect(() => {
    console.log(
      "🚀 ~ file: RoomContext.jsx:33 ~ React.useEffect ~ useEffect:",
      useEffect
    );

    // get stream local
    (async () => {
      await getLocalStream();
    })();

    // start peer
    const peer = new Peer("buenas", {
      host: process.env.REACT_APP_PEER_SERVER || "peer-qvf4.onrender.com",
      port: Number(process.env.REACT_APP_PEER_PORT) || 443,
      secure: true,
      path: "/",
    });

    peer.on("error", (error) => {
      console.log("🚀 ~ file: RoomContext.jsx:38 ~ peer.on ~ error:", error);
    });

    // define event sockets
    ws.on("connect", () => {
      console.log("🚀 ~ [SOCKET] ws connected");
    });

    ws.on("room-created", enterRoom);
    ws.on("emit-streaming", reemitStreaming);
    ws.on("user-disconnected", removePeer);
    ws.on("error", (error) => {
      console.error("🚀 ~ [SOCKET] error", error);
    });

    return () => {
      ws.off("room-created");
      ws.off("emit-streaming");
      ws.off("user-disconnected");
      ws.off("error");
      me?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerName(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStream(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  const getLocalStream = async () => {
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? "front" : "environment";
    const videoSourceId = devices.find(
      (device) => device.kind === "videoinput" && device.facing === facing
    );
    const facingMode = isFront ? "user" : "environment";
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setStream(newStream);
  };

  /* Func soket */
  const enterRoom = async ({ roomId }) => {
    setRoomId(roomId);
    console.log("🚀 ~ file: RoomContext.jsx:115 ~ enterRoom ~ enterRoom:", {
      roomId,
    });
    await emitStreaming();
  };

  const removePeer = (peerId) => {
    dispatch(removePeerStream(peerId));
  };

  const emitStreaming = async () => {
    const genUserId = customGenerationFunction();

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("roomId", roomId);
    await AsyncStorage.setItem("peerId", genUserId);

    ws.emit("join-room", {
      roomId: "venezuela",
      peerId: genUserId,
      userName: customGenerationFunction(),
      token,
    });
  };

  const reemitStreaming = async () => {
    const token = await AsyncStorage.getItem("token");
    const roomId = await AsyncStorage.getItem("roomId");
    const peerId = await AsyncStorage.getItem("peerId");
    if (token) {
      ws.emit("join-room", {
        roomId: "venezuela",
        peerId,
        userName: customGenerationFunction(),
        token,
      });
    }
  };

  return (
    <>
      <RoomContext.Provider
        value={{
          stream,
          roomId,
          setRoomId,
          emitStreaming,
          token,
          setToken,
        }}
      >
        {children}
      </RoomContext.Provider>
    </>
  );
};
