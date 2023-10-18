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

const configuration = {
  iceServers: [{ urls: "http://peer-qvf4.onrender.com:443" }],
  iceCandidatePoolSize: 10,
};

const Streaming = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

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
    setLocalStream(newStream);
  };

  const startCall = async () => {
    const localPC = new RTCPeerConnection({
      configuration: {
        iceServers: [{ urls: "http://peer-qvf4.onrender.com:443" }],
      },
    });

    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
    });

    localPC.ontrack = (e) => {
      console.log("🚀 ~ file: streaming.js:75 ~ startCall ~ e:", e);
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);
  };

  return (
    <>
      <Text>Stremaing Stremaing</Text>
      <RTCView
        mirror={true}
        objectFit={"cover"}
        streamURL={localStream && localStream?.toURL()}
        style={{ backgroundColor: "red", width: 200, height: 200 }}
      />

      {remoteStream && (
        <RTCView
          className="flex-1"
          streamURL={remoteStream && remoteStream.toURL()}
          objectFit={"cover"}
        />
      )}

      <TouchableOpacity onPress={startCall}>
        <Text>Start Call</Text>
      </TouchableOpacity>
    </>
  );
};

export default Streaming;

/* useEffect(() => {
    // Configura el objeto RTCPeerConnection
    pcRef.current = new RTCPeerConnection({
      configuration: {
        iceServers: [{ urls: "http://peer-qvf4.onrender.com:443" }],
      },
    }); */

// Obtiene acceso a la cámara y al micrófono
/* mediaDevices
      .getUserMedia({
        video: {
          frameRate: 30,
          facingMode: "user",
        },
        audio: true,
      })
      .then((stream) => {
        stream.getVideoTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
          localStreamRef.current = stream;
        }); */

// Obtén las pistas de video y audio y agrégalas a la conexión RTCPeerConnection
/* stream.getTracks().forEach((track) => {
        console.log(
          "🚀 ~ file: streaming.js:24 ~ stream.getTracks ~ track:",
          track
        );
        pcRef.current.addTrack(track, stream);
      });
 */
// Establece la vista local de la cámara
// Puedes usar localStreamRef para mostrar la vista local
/* }); */

// Agrega un oyente de eventos para manejar los eventos WebRTC, como la recepción de corriente remota
/* pcRef.current.onaddstream = (event) => {
      // Muestra la corriente remota en el ref del video remoto
      remoteVideoRef.current.srcObject = event.stream;
    };
    return () => {
      // Cierra la conexión y libera recursos al desmontar el componente
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, []); */
