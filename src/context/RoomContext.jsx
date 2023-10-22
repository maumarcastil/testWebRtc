import { useDispatch } from "react-redux";
import { mediaDevices } from "react-native-webrtc";
import { createContext, useEffect, useState } from "react";

import { StreamingService } from "../services/streamingService"

export const RoomContext = createContext();
export const RoomProvider = ({ children }) => {
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJtbTg3dXMwd05oT3c4cFl5T0ZqaWFFR1BuVmUyIiwiZW1haWwiOiJnYXZlaGF0NDQwQGVsaXhpcnNkLmNvbSIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE2OTc3NzM3MzYsImV4cCI6MjAxMzM0OTczNn0.fSPsCYPu_t6nW7C4fKdBj4dTJV9U8qHS_1PyoRioxLw"
  );
  /* redux */
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await getLocalStream();
    })();
  }, []);

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
      video: true,
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setStream(newStream);
    const streamingService = new StreamingService();
    streamingService.joinRoom(newStream);
  };

  return (
    <>
      <RoomContext.Provider
        value={{
          stream,
          roomId,
          token,
          setRoomId,
          setToken,
        }}
      >
        {children}
      </RoomContext.Provider>
    </>
  );
};
