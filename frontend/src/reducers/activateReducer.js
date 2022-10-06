import { createSlice } from "@reduxjs/toolkit";

export const activateReducers = createSlice({
    name : "activeButtons",
    initialState : {
        addAreaBtn : false,
    },
    reducers: {
        setAddAreaBtn : (state, action) => {
            state.addAreaBtn = action.payload
            },

    }
});

export const {setAddAreaBtn} = activateReducers.actions

export default activateReducers.reducer