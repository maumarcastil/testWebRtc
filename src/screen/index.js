import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// import Streaming from "../components/Streaming.js";
import { RoomContext } from "../context/RoomContext2.jsx";
import { Home } from "../components/Home.jsx";
import { Room } from "../components/Room.jsx";

export default function Index() {
  const { roomId } = useContext(RoomContext);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {roomId === ""
        ? (<Home />)
        : (<Room />)
      }
      <Text>Open up App.js to start working on your app!</Text>
      {/* <Streaming /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
