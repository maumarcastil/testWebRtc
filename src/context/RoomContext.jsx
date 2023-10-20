import * as React from "react";
import Peer from "react-native-peerjs";
import { mediaDevices } from "react-native-webrtc";

import { ws } from "../config/ws";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllPeers,
  addPeerName,
  addPeerStream,
  removePeerStream,
} from "../redux/slices/peerSlice";

export const RoomContext = React.createContext();

export const RoomProvider = ({ children }) => {
  const [me, setMe] = React.useState();
  const [stream, setStream] = React.useState();

  /* redux */
  const dispatch = useDispatch();
  const state = useSelector((state) => state.peerReducer);
  console.log("🚀 ~ file: RoomContext.jsx:24 ~ RoomProvider ~ state:", state);

  React.useEffect(() => {
    console.log("🚀 ~ file: RoomContext.jsx:9 ~ useEffect ~ useEffect:");

    const peer = new Peer("hola", {
      host: process.env.REACT_APP_PEER_SERVER || "peer-qvf4.onrender.com",
      port: Number(process.env.REACT_APP_PEER_PORT) || 443,
      secure: true,
      path: "/",
    });

    peer.on("error", (error) => {
      console.log("🚀 ~ file: RoomContext.jsx:38 ~ peer.on ~ error:", error);
    });

    setMe(peer);
    // get Media
    (async () => {
      try {
        await getLocalStream();
      } catch (error) {
        console.log(
          "🚀 ~ file: RoomContext.jsx:27 ~ React.useEffect ~ error:",
          error
        );
      }
    })();

    // define event sockets
    ws.on("connect", () => {
      console.log("🚀 ~ [SOCKET] ws connected");
    });

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("error", (error) => {
      console.error("🚀 ~ [SOCKET] error", error);
    });

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-joined");
      ws.off("error");
      me?.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!me || !stream) return;

    ws.on("user-joined", ({ peerId, userName: name, role }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
          role,
        },
      });
      call.on("stream", (peerStream) => {
        dispatch(addPeerStream(peerId, peerStream));
      });
      dispatch(addPeerName(peerId, name, role));
    });

    me.on("call", (call) => {
      const { userName, role } = call.metadata;
      dispatch(addPeerName(call.peer, userName, role));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStream(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("user-joined");
    };
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

  /* FUNC SOCKET */
  const enterRoom = ({ roomId }) => {
    /* navigate(`/room/${roomId}`); */
    console.log("🚀 ~ file: RoomContext.jsx:86 ~ enterRoom ~ enterRoom:", {
      roomId,
    });
    ws.emit("join-room", {
      roomId,
      peerId: userId,
      userName: newUserName(token),
      token,
    });
  };

  const getUsers = ({ partcipants }) => {
    dispatch(addAllPeers(partcipants));
    console.log(
      "🚀 ~ file: RoomContext.jsx:83 ~ getUsers ~ partcipants:",
      partcipants
    );
  };

  const removePeer = (peerId) => {
    dispatch(removePeerStream(peerId));
    console.log("🚀 ~ file: RoomContext.jsx:100 ~ removePeer ~ removePeer:", {
      peerId,
    });
  };

  return (
    <>
      <RoomContext.Provider
        value={{
          stream,
        }}
      >
        {children}
      </RoomContext.Provider>
    </>
  );
};
