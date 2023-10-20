import { createSlice } from "@reduxjs/toolkit";

const peerSlice = createSlice({
  name: "peer",
  initialState: {},
  reducers: {
    addPeerStream: (state, action) => {
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      };
    },
    addPeerName: (state, action) => {
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          userName: action.payload.userName,
          role: action.payload.role,
        },
      };
    },
    removePeerStream: (state, action) => {
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: null,
        },
      };
    },
    addAllPeers: (state, action) => {
      return {
        ...state,
        ...action.payload.peers,
      };
    },
  },
});

export const { addAllPeers, addPeerName, addPeerStream, removePeerStream } =
  peerSlice.actions;

export default peerSlice.reducer;
