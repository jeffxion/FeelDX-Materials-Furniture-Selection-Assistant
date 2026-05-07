import { createSlice } from "@reduxjs/toolkit";

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    roomSelected: "",
    selectedItems: [],
    aiGenerated: false,
  },
  reducers: {
    getSelectedRoom(state, action) {
      state.roomSelected = action.payload;
      state.aiGenerated = false;
    },
    getSelectedItems(state, action) {
      state.selectedItems = action.payload;
    },
    setAiGenerated(state, action) {
      state.aiGenerated = action.payload;
    },
  },
});

export const roomsActions = roomsSlice.actions;

export default roomsSlice;
