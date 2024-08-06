import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  confirmPromise?: {
    resolve: (result: boolean) => void;

    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    allowCancel?: boolean;
  };
  passwordUpdateDialogOpen: boolean;
  passwordUpdateDialogShownOnce: boolean;
  sessionExpired: boolean;
}

const initialState: AppState = {
  passwordUpdateDialogOpen: false,
  passwordUpdateDialogShownOnce: false,
  sessionExpired: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConfirmPromise(state, action) {
      return {
        ...state,
        confirmPromise: action.payload,
      };
    },

    closeConfirm(state) {
      return {
        ...state,
        confirmPromise: undefined,
      };
    },
    showPasswordUpdateDialog(state) {
      return {
        ...state,
        passwordUpdateDialogOpen: true,
      };
    },
    hidePasswordUpdateDialog(state) {
      return {
        ...state,
        passwordUpdateDialogOpen: false,
        passwordUpdateDialogShownOnce: true,
      };
    },
    setSessionExpired(state, action) {
      return {
        ...state,
        sessionExpired: action.payload,
      };
    },
  },
});

export const {
  setConfirmPromise,
  closeConfirm,
  showPasswordUpdateDialog,
  hidePasswordUpdateDialog,
  setSessionExpired,
} = appSlice.actions;
export default appSlice.reducer;
export const selectApp = (state: { app: AppState }) => state.app;
