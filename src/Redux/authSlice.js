import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userAuthCheck: JSON.parse(localStorage.getItem('user_data')) ? true : false,
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        //actions
        authCheck: (state, action)=>{
            state.userAuthCheck=action.payload;
        },
    },
})

export const {authCheck} = authSlice.actions;

export default authSlice.reducer;
