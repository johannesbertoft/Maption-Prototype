import { createSlice } from "@reduxjs/toolkit";
import {
  defaultBackGroundLayer,
  defaultFillLayer,
  defaultCircleLayer,
  defaultLineLayer,
  defaultSymbolLayer,
} from "../utils/DefaultLayers";
import { layerPainter } from "../utils/PaintProperties";

export const layers = createSlice({
  name: "layers",
  initialState: {
    layers: [], 
    minutes: 15
  },
  reducers: {
    addLayers: (state, action) => {
      state.layers = action.payload;
    },

    addLayer: (state, action) => {
      
      const areaId = action.payload.areaId
      switch (action.payload.type) {
        case "area":
          state.layers.push({
            areaId: areaId,
            layerName: "area",
            layer: {
              ...defaultFillLayer,
              id: action.payload.id,
              source: action.payload.sourceId,
            },
          });
          break;
        case "hex":
          state.layers.push({
            areaId: areaId,
            layerName: action.payload.name,
            layer: {
              ...defaultFillLayer,
              id: `hex_${areaId}`,
              source: `hex_${areaId}`,
              paint: {
                ...defaultFillLayer.paint,
                "fill-color": layerPainter.paintPropertyColor("score", state.minutes),
              },
            },
          });
          break;
        case "point":
          state.layers.push({
            areaId: areaId,
            layerName: "Distance to nearest",
            layer: {
              ...defaultCircleLayer,
              id: `waynodes_${areaId}`,
              source: `waynodes_${areaId}`,
              paint: {
                ...defaultCircleLayer.paint,
                "circle-color": layerPainter.paintPropertyColor(
                  `nearest ${action.payload.property}`, state.minutes
                ),
              },
            },
          });
          break;
        case "background":
          state.layers.push({
            areaId: areaId,
            layer: {
              ...defaultBackGroundLayer,
              id: action.payload.id,
            },
          });
          break;
        case "line":
          state.layers.push({
            areaId: areaId,
            layerName: "streets",
            layer: {
              ...defaultLineLayer,
              id: `ways_${action.payload.id}`,
              source: `ways_${areaId}`,
            },
          });
          break;
        case "symbol":
          state.layers.push({
            areaId: areaId,
            layerName: "Points of Interest (POI)",
            layer: {
              ...defaultSymbolLayer,
              id: `pois_${areaId}`,
              source: `pois_${areaId}`,
            },
          });
          break;
        default:
          break;
      }
    },

    removeAreaLayers: (state, action) => {
        state.layers = state.layers.filter(
            (l) => l.areaId !== action.payload
        )
    },
    removeLayer: (state, action) => {
      state.layers = state.layers.filter(
        (l) => l.layer.id !== action.payload
      );
    },

    toggleLayerVisibility: (state, action) => {
      state.layers = state.layers.map((l) => {
        if (l.layer.id !== action.payload.id) {
          return l;
        }
        const layer = l.layer;
        const updatedVis =
          layer.layout.visibility === "visible" ? "none" : "visible";
        const updatedLayer = {
            ...layer,
            layout : {
                ...layer.layout,
                visibility: updatedVis
            }
        }
        return {
            ...l,
            layer: updatedLayer
            };
        })
    }, 

    changeSize: (state, action) => {
      state.layers = state.layers.map((l) => {
        if (l.layer.id !== action.payload.id) {
          return l;
        }
        const layer = l.layer;
        const updatedLayer = {
            ...layer,
            paint : {
                ...layer.paint,
                "circle-radius": action.payload.size
            }
        }
        return {
          ...l,
          layer: updatedLayer
        };
      });
    },
    clearLayers: (state, action) => {
      const areaId = action.payload
      state.layers = state.layers.filter((layer) => 
          layer.layer.id !== `hex_${areaId}` && 
          layer.layer.id !== `pois_${areaId}` &&
          layer.layer.id !== `waynodes_${areaId}` 
      )
    },
    setWayNodeLayerProperty: (state, action) => {
      state.layers = state.layers.map((l) => {
        if (l.layer.id !== action.payload.id) {
          return l;
        }
        const property = action.payload.selected;
        const color = layerPainter.paintPropertyColor(`nearest ${property}`, state.minutes);
        const layer = l.layer;
        const updatedLayer = {
            ...layer,
            paint : {
                ...layer.paint,
                "circle-color": color
            }
        }
        return {
          ...l,
          layer: updatedLayer
        };
      });
    },
  },
});

export const {
  addLayers,
  toggleLayerVisibility,
  changeSize,
  addAmenities,
  addLayer,
  removeLayer,
  removeAreaLayers,
  setWayNodeLayerProperty,
  clearLayers
} = layers.actions;

export default layers.reducer;
