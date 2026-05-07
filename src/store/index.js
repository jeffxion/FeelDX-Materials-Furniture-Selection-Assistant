import { configureStore } from "@reduxjs/toolkit";

import roomsSlice from "./rooms";

const store = configureStore({
  reducer: { 
    roomscontain: roomsSlice.reducer,
  },
});

export default store;
