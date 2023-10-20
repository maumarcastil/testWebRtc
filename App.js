// import { Provider } from "react-redux";
// import { StyleSheet, Text, View } from "react-native";

import { RoomProvider } from "./src/context/RoomContext2.jsx";
import { UserProvider } from "./src/context/UserContext.jsx";
import Index from "./src/screen/index.js";

/* redux */
// import { store } from "./src/redux/store.js";
// import { RoomProvider } from "./src/context/RoomContext.jsx";

export default function App() {
  return (
    <>
      {/* <Provider store={store}> */}
      <UserProvider>
        <RoomProvider>
          <Index />
        </RoomProvider>
      </UserProvider>
      {/* </Provider> */}
    </>
  );
}
