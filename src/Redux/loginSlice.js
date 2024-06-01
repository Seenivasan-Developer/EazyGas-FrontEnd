import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticate: false
}

const loginSlice = createSlice({
    name: "userAuthCheck",
    initialState,
    reducers: {
        // action
        authCheck: (state, action) => {
            let userAuthCheck = state.authenticate.push( action.payload );
            console.log("userAuthCheck", userAuthCheck)
        }
    }
})

export const { authCheck } = loginSlice.actions

export default loginSlice.reducer