import LayersIcon from "@mui/icons-material/Layers";
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Card,
  Button,
  ButtonGroup,
  IconButton,
  CardHeader,
  CardContent,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayerToggle from "./LayerToggle";
import BackGroundLayerItem from "./LayerItems/BackGroundLayerItem";
import StreetLayerItem from "./LayerItems/StreetsLayerItem";
import NodeLayerItem from "./LayerItems/NodeLayerItem";
import HexagonLayerItem from "./LayerItems/HexagonLayerItem";
import POILayerItem from "./LayerItems/PoiLayerItem";
import { Grid } from "@mui/material";

function Layers(props) {
  const areaLayers = useSelector((state) => state.layerReducers.layers).filter(
    (layer) => layer.areaId === props.areaId
  );
  const backgroundLayer = areaLayers.find(
    (layer) => layer.layerName === "area"
  );
  const streetNetworkLayer = areaLayers.find(
    (layer) => layer.layerName === "streets"
  );
  const waynodeLayer = areaLayers.find(
    (layer) => layer.layerName === "Distance to nearest"
  );
  const hexagonLayer = areaLayers.find(
    (layer) => layer.layerName === "hexagon"
  );
  const poiLayer = areaLayers.find(
    (layer) => layer.layerName === "Points of Interest (POI)"
  );

  return (
    <Card spacing={1} sx={{ bgcolor: "#F1F3F1" }}>
      <CardHeader title={<Typography variant="h7">Layers</Typography>} avatar={<LayersIcon />}></CardHeader>
        <CardContent>
        <List
          overflow="auto"
          sx={{ width: "100%", maxWidth: 360 }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {backgroundLayer !== undefined && (
                <BackGroundLayerItem
                  layer={backgroundLayer}
                ></BackGroundLayerItem>
              )}
            </Grid>
            <Grid item xs={12}>
              {streetNetworkLayer !== undefined && (
                <StreetLayerItem layer={streetNetworkLayer}></StreetLayerItem>
              )}
            </Grid>
            <Grid item xs={12}>
              {waynodeLayer !== undefined && (
                <NodeLayerItem layer={waynodeLayer}></NodeLayerItem>
              )}
            </Grid>
            <Grid item xs={12}>
              {hexagonLayer !== undefined && (
                <HexagonLayerItem layer={hexagonLayer}></HexagonLayerItem>
              )}
            </Grid>
            <Grid item xs={12}>
              {poiLayer !== undefined && (
                <POILayerItem layer={poiLayer}></POILayerItem>
              )}
            </Grid>
          </Grid>
        </List>
        </CardContent>
    </Card>
  );
}

export default Layers;
