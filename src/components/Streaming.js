import * as React from "react";
import { RTCView } from "react-native-webrtc";
import { Text, TouchableOpacity } from "react-native";

import { RoomContext } from "../context/RoomContext";
import { ws } from "../config/ws";

const Streaming = () => {
  // get stream context
  const { stream: localStream } = React.useContext(RoomContext);

  const createRoom = React.useCallback(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJtbTg3dXMwd05oT3c4cFl5T0ZqaWFFR1BuVmUyIiwiZW1haWwiOiJnYXZlaGF0NDQwQGVsaXhpcnNkLmNvbSIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE2OTc3NzAwNjUsImV4cCI6MjAxMzM0NjA2NX0.rnkqWPVJl40alfsYh1prV39Vl47FXDPhBUqgRrzKCho";
    ws.emit("create-room", { token });
  }, []);

  return (
    <>
      <Text>Stremaing Stremaing</Text>
      <RTCView
        mirror={true}
        objectFit={"cover"}
        streamURL={localStream && localStream?.toURL()}
        style={{ backgroundColor: "red", width: 200, height: 200 }}
      />
      {/* {streams &&
        streams?.map((stream) => (
          <>
            <RTCView
              mirror={true}
              objectFit={"cover"}
              streamURL={stream && stream?.toURL()}
              style={{ backgroundColor: "red", width: 200, height: 200 }}
            />
          </>
        ))} */}

      {/* {remoteStream && (
        <RTCView
          className="flex-1"
          streamURL={remoteStream && remoteStream.toURL()}
          objectFit={"cover"}
        />
      )} */}

      <TouchableOpacity onPress={createRoom}>
        <Text>Start Call</Text>
      </TouchableOpacity>
    </>
  );
};

export default Streaming;
