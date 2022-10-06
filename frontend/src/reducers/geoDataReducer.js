import { createSlice } from "@reduxjs/toolkit";
import * as turf from '@turf/turf'
import {calcFeatureValue, average} from "../utils/hexFunctions"

export const geoData = createSlice({
    name : "geoData",
    initialState : {
        polygon : {},
        nodeData : {},
        sources : [],
        areas : [],
        activeArea: "",
    },
    reducers: {
        setActiveArea : (state, action) => {
            state.activeArea = action.payload
        },
        addPolygon : (state, action) => {
            state.polygon = action.payload
        },
        addNodeData : (state, action) => {
            state.nodeData = action.payload
        },
        addSources : (state, action) => {
            const area = action.payload.areaId
            state.sources.push({
                areaId: area,
                source: {
                    id : `ways_${area}`,
                    type : "geojson",
                    data : action.payload.edges
                  }
                })
            state.sources.push({
                areaId : area,
                source: {
                    id : `waynodes_${area}`,
                    type : "geojson",
                    data : action.payload.waynodes 
                }
            })
            state.sources.push({
                areaId : area,
                source: {
                    id : `pois_${area}`,
                    type : "geojson",
                    data : action.payload.pois
                }
            })
          
            // const hexsource = {
            //     id : "hexsource",
            //     type : "geojson",
            //     data : hexgrid(waynodes, amenities[0])
            //   }
          
            // const clustersource = {
            //     id : "clustersource",
            //     type : "geojson",
            //     data : pois,
            //     cluster : true,
            //     clusterMaxZoom : 20,
            //     clusterRadius : 50    
            //   }
        },
        addSource : (state, action) => {
            const area = action.payload.areaId
            const sourceType = action.payload.sourceType
            state.sources.push({
                areaId: area,
                source: {
                    id : `${sourceType}_${area}`,
                    type : "geojson",
                    data : action.payload.data
                  }
                })
        },
        addHexSource : (state, action) => {
            const area = action.payload.areaId
            const waynodes = action.payload.waynodes
            const cll = calcFeatureValue(waynodes, action.payload.amenities, average)
            state.sources.push({
                areaId: area,
                source: {
                    id : `"hex"_${area}`,
                    type : "geojson",
                    data : waynodes
                  }
                })
        },
        addArea : (state, action) => {
            state.areas.unshift({
                    id: action.payload.id,
                    areaName: action.payload.name,
                    centerPoint: turf.centroid(action.payload.data).geometry,
                    amenities: []
                })
            state.sources.push({
                    areaId: action.payload.id,
                    source: {
                        id: action.payload.id,
                        type: "geojson",
                        data: action.payload.data
                    }
                })
                
        },

        addAmenities: (state, action) => {
            state.areas = state.areas.map((area) => {
                if (area.id !== action.payload.areaId) {
                    return area
                }
                return {
                    ...area,
                    amenities: action.payload.amenities
                    }
                }
            
            )
        },

        clearSources: (state, action) => {
            const areaId = action.payload
            state.sources = state.sources.filter((source) => 
                source.source.id !== `hex_${areaId}` && 
                source.source.id !== `pois_${areaId}` &&
                source.source.id !== `waynodes_${areaId}` 
            )
        },

        removeArea : (state, action) => {
            state.areas = state.areas.filter((area) => 
                area.id !== action.payload
            )
            state.sources = state.sources.filter((source) =>
                source.areaId !== action.payload
            ) 
        },

        changeClusterSize : (state, action) => {
            state.sources = state.sources.map((source) => {
                if (source.id !== action.payload.sourceId) {
                    return source
                }
                return {...source, clusterRadius: action.payload.clusterSize}
            })
        },

        changeHexSize : (state, action) => {
            
            state.sources = state.sources.map((source) => {
                if (source.areaId === action.payload.area && source.source.id === `hex_${action.payload.area}`) {
                    const sourceNew = source.source
                    const updatedSource = {
                        ...sourceNew,
                        data: action.payload.data
                    }
                    return {...source, source: updatedSource}
                }
                return source
                
            })
        }

    }
})

export const {addSources,addSource, changeClusterSize, changeHexSize, addNodeData, addPolygon, addArea, removeArea, setActiveArea, addAmenities, addHexSource, clearSources} = geoData.actions

export default geoData.reducer