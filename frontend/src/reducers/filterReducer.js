import { createSlice } from "@reduxjs/toolkit";

export const filterSettings = createSlice({
    name : "filterSettings",
    initialState : {
        tag : false,
        options : false,
        amenity : false
    },
    reducers: {
        updateTag : (state, action) => {
            state.tag = action.payload.tag
            },
        updateOptions : (state, action) => {
            state.options = action.payload.options
            },
            updateAmenity : (state, action) => {
                state.amenity = action.payload.amenity
                }
        }
    })

export const {updateTag, updateOptions, updateAmenity} = filterSettings.actions

export default filterSettings.reducer