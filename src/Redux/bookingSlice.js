import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    newBookings: []
}

const bookingSlice = createSlice({
    name: "newBooking",
    initialState,
    reducers: {
        // action
        addNewBooking: (state, action) => {
            let newBookingData = state.newBookings.push(action.payload);
            console.log("newBookingData", newBookingData)
        }
    }
})

export const {addNewBooking} = bookingSlice.actions

export default bookingSlice.reducer