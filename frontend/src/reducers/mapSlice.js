import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geometry: [],
    amenities: [],
    queries: [],
}


export const mapSlice = createSlice({
  name: "mapSettings",
  initialState: {
    geometry: [],
    amenities: [],
    queries: [],
  },
  reducers: {

    updateGeometry: (state, action) => {
      state.geometry = action.payload;
      

    },
    updateExistingAmenities: (state, action) => {
      state.amenities = action.payload.amenities
    },
    insertAmenity: (state,action) => {
      state.queries.push(action.payload)

    },
   
    updateFilters: (state, action) => {

     for (let index = 0; index < state.queries.length; index++) {
      if (state.queries[index].amenity === action.payload.amenity) {
        state.queries[index].filter = action.payload.filter
      }
      
     }

     
        
        
    
    
    },
    resetQueries: (state) => {
      state.amenities = []
      state.queries = []
      state.geometry = []
    }
  },

  


});

// Action creators are generated for each case reducer function
export const {
  updateFilters,
  updateGeometry,
  resetQueries,
  updateExistingAmenities,
  insertAmenity
} = mapSlice.actions;

export default mapSlice.reducer;