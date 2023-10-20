import * as React from "react";
import { RTCView } from "react-native-webrtc";
import { Text } from "react-native";

import { RoomContext } from "../context/RoomContext";

const Streaming = () => {
  // get stream context
  const { stream: localStream } = React.useContext(RoomContext);

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

      {/* <TouchableOpacity onPress={startCall}>
        <Text>Start Call</Text>
      </TouchableOpacity> */}
    </>
  );
};

export default Streaming;
