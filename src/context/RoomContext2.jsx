import { createContext, useEffect, useState, useReducer, useContext } from "react";
import Peer from "react-native-peerjs";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
} from "../reducers/peerActions";
import { mediaDevices } from "react-native-webrtc";

import { UserContext } from "./UserContext";
import { ws } from "../config/ws";
import { parseJwt } from "../utils/parseJwt";
import { localStorage } from "../utils/localStorage";

function getUserName(token, calledBy) {
  console.log({ token, calledBy })
  const payload = parseJwt(token)
  console.log({ payload })
  const usuario = payload.email
  return usuario
}

export const RoomContext = createContext({
  peers: {},
  setRoomId: (id) => { },
  roomId: "",
  emitStreaming: () => { },
  token: "",
  setToken: (token) => { },
});


export const RoomProvider = ({ children }) => {
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState("")

  const enterRoom = ({ roomId }) => {
    setRoomId(roomId)
  };

  const removePeer = (peerId) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const emitStreaming = async () => {
    await localStorage.setItem("token", token)
    await localStorage.setItem("roomId", roomId)
    await localStorage.setItem("peerId", userId)
    ws.emit("join-room", { roomId, peerId: userId, userName: getUserName(token, "ws.emit"), token });
  }

  const reemitStreaming = async () => {
    const token = await localStorage.getItem("token")
    const roomId = await localStorage.getItem("roomId")
    const peerId = await localStorage.getItem("peerId")
    if (token) {
      ws.emit("join-room", { roomId, peerId, userName: getUserName(token, "ws.emitRE"), token })
    }
  }

  useEffect(() => {
    const setupMediaStream = async () => {
      try {
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
        const stream = await mediaDevices.getUserMedia(constraints);
        setStream(stream);
      } catch (error) {
        console.error(error);
      }
    };

    setupMediaStream();

    const peer = new Peer(userId, {
      host: process.env.REACT_APP_PEER_SERVER || "peer-qvf4.onrender.com",
      port: Number(process.env.REACT_APP_PEER_PORT) || 443,
      secure: true,
      path: "/",
    });
    setMe(peer);

    ws.on("room-created", enterRoom);
    ws.on("emit-streaming", reemitStreaming);
    ws.on("user-disconnected", removePeer);
    ws.on("error", console.error)

    return () => {
      ws.off("room-created");
      ws.off("emit-streaming");
      ws.off("user-disconnected");
      ws.off("error");
      me?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      console.log({userName})
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

  }, [me, stream, userName]);

  return (
    <RoomContext.Provider value={{
      stream,
      peers,
      roomId,
      setRoomId,
      emitStreaming,
      token,
      setToken,
    }}>
      {children}
    </RoomContext.Provider>
  );
};