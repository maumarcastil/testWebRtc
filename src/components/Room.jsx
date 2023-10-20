import { useContext, useEffect } from "react";
import { RoomContext } from "../context/RoomContext2";
import { UserContext } from "../context/UserContext";
import { Text, View } from "react-native";
import { RTCView } from "react-native-webrtc";

export const Room = () => {
  const { stream, setRoomId, emitStreaming, token } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);

  useEffect(() => {
    if (stream)
      emitStreaming()
  }, [setRoomId, userId, stream, userName, token]);

  return (
    <View>
      <Text>Stremaing Stremaing</Text>
      <RTCView
        mirror={true}
        objectFit={"cover"}
        streamURL={stream && stream?.toURL()}
        style={{ backgroundColor: "red", width: 200, height: 200 }}
      />
    </View>
  );
};
