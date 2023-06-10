import { createSlice } from "@reduxjs/toolkit";

const possibleUser = JSON.parse(localStorage.getItem("user"));
const baseUser = { id: 0 };

const initialState = {
  mode: "dark",
  user: possibleUser ? possibleUser.user : baseUser,
  token: possibleUser
    ? `${possibleUser.token_type} ${possibleUser.access_token}`
    : null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = baseUser;
      state.token = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setMode, setLogin, setLogout } = globalSlice.actions;

export default globalSlice.reducer;
