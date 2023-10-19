import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";
import { useDispatch, useSelector } from "react-redux";
import { joinRoom } from "../redux/actions/videoActions";

const configuration = {
  iceServers: [{ urls: "http://peer-qvf4.onrender.com:443" }],
  iceCandidatePoolSize: 10,
};

const Streaming = () => {
  const dispatch = useDispatch();
  const { myStream, streams } = useSelector((state) => state.videoReducer);

  useEffect(() => {
    (async () => {
      await startLocalStream();
    })();
  }, []);

  const startLocalStream = async () => {
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
    dispatch(joinRoom(newStream));
  };

  return (
    <>
      <Text>Stremaing Stremaing</Text>
      <RTCView
        mirror={true}
        objectFit={"cover"}
        streamURL={myStream && myStream?.toURL()}
        style={{ backgroundColor: "red", width: 200, height: 200 }}
      />
      {streams &&
        streams?.map((stream) => (
          <>
            <RTCView
              mirror={true}
              objectFit={"cover"}
              streamURL={stream && stream?.toURL()}
              style={{ backgroundColor: "red", width: 200, height: 200 }}
            />
          </>
        ))}

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
