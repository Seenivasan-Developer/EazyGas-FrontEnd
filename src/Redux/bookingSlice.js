import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    editabledata: []
}

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        // action
        editableBooking: (state, action) => {
            console.log(action.payload)
            console.log(state.editabledata)
            state.editabledata.push(action.payload);
        }
    }
})

export const { editableBooking } = bookingSlice.actions

export default bookingSlice.reducer