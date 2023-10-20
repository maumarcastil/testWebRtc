import { configureStore } from "@reduxjs/toolkit";

/* slice */
import videoReducer from "./slices/videoSlice";
import peerReducer from "./slices/peerSlice";

export const store = configureStore({
  reducer: {
    videoReducer,
    peerReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
