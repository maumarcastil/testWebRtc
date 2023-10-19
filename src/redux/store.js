import { configureStore } from "@reduxjs/toolkit";

/* slice */
import videoReducer from "./slices/videoSlice";

export const store = configureStore({
  reducer: {
    videoReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
