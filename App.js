import { Provider } from "react-redux";
import { StyleSheet, Text, View } from "react-native";

import Index from "./src/screen/index.js";

/* redux */
import { store } from "./src/redux/store.js";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Index />
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
