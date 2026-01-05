import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerShow: false,
  drawerData: {},
  drawerType: "",
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    showDrawer: (state, { payload }) => {
      state.drawerShow = true;
      state.drawerData = payload?.drawerData;
      state.drawerType = payload?.drawerType;
    },
    closeDrawer: (state, action) => {
      state.drawerShow = false;
      state.drawerData = {};
      state.drawerType = "";
    },
  },
});

export default drawerSlice.reducer;
export const { showDrawer, closeDrawer } = drawerSlice.actions;
export const selectDrawer = (state) => state.drawer;
