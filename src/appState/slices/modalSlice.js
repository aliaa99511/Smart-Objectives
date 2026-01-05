import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalShow: false,
  modalData: {},
  modalType: "",
  modalSize: "xs", // Use one of: 'xs', 'sm', 'md', 'lg', 'xl'
  modalTitle: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state, { payload }) => {
      state.modalShow = true;
      state.modalData = payload?.modalData;
      state.modalType = payload?.modalType;
      state.modalSize = payload?.modalSize || "xs";
      state.modalTitle = payload?.modalTitle || "";
    },
    closeModal: (state, action) => {
      state.modalShow = false;
      state.modalData = {};
      state.modalType = "";
      state.modalSize = "xs";
      state.modalTitle = "";
    },
  },
});

export default modalSlice.reducer;
export const { showModal, closeModal } = modalSlice.actions;
export const selectModal = (state) => state.modal;
