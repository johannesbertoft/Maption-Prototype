import { combineReducers } from '@reduxjs/toolkit'
import mapReducer from "./reducers/mapSlice"
import addGeoData from "./reducers/geoDataReducer"
import filter  from './reducers/filterReducer'
import layerReducers from './reducers/layerReducers'
import activateReducers from './reducers/activateReducer'


const allReducers = combineReducers({ 
    mapSettings: mapReducer,
    geoData : addGeoData,
    filterSettings : filter,
    layerReducers : layerReducers,
    activateReducers : activateReducers

})

export default allReducers