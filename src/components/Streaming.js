import * as React from "react";
import { RTCView } from "react-native-webrtc";
import { Text, TouchableOpacity } from "react-native";

import { RoomContext } from "../context/RoomContext";
import { ws } from "../config/ws";

const Streaming = () => {
  // get stream context
  const { stream: localStream, token } = React.useContext(RoomContext);

  React.useEffect(() => {}, []);

  const createRoom = React.useCallback(() => {
    console.log("🚀 ~ file: Streaming.js ~ line 71 ~ createRoom ~ token");
    /* ws.emit("create-room", { token }); */
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
