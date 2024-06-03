import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    providerdata: []
}

const providerSlice = createSlice({
    name: "provider",
    initialState,
    reducers: {
        // action
        providerDetails: (state, action) => {
           state.providerdata=[];
            state.providerdata.push(action.payload);
        }
    }
})

export const { providerDetails } = providerSlice.actions

export default providerSlice.reducer