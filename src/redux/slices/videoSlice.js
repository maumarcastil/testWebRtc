import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myStream: null,
  streams: [],
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    setMyStream: (state, action) => {
      state.myStream = action.payload;
    },
    setStreams: (state, action) => {
      state.streams = [...state.streams, action.payload];
    },
  },
});

export const { setMyStream, setStreams } = videoSlice.actions;

export default videoSlice.reducer;
