import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userAuthCheck: JSON.parse(localStorage.getItem('user_data')) ? true : false,
    userDetail: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //actions
        authCheck: (state, action) => {
            state.userAuthCheck = action.payload;
        },
        userData: (state, action) => {
            state.userDetail.push(action.payload);
        },
        logout: (state) => {
            state.userAuthCheck=false;
            state.userDetail = [];
            localStorage.removeItem('user_data');
         },
    },
})

export const { authCheck, userData, logout } = authSlice.actions;

export default authSlice.reducer;
