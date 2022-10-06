import GrainOutlined from "@mui/icons-material/GrainOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import {
  Box,
  Collapse, Container, FormControl, Grid, MenuItem, Rating, Select, Slider
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSize,
  setWayNodeLayerProperty
} from "../../reducers/layerReducers.js";
import LayerToggle from "../LayerToggle";

function NodeLayerItem(props) {
  const [expandSettings, setExpandSettings] = useState(false);
  const [numPois, setNumPois] = useState(1);
  const dispatch = useDispatch();
  const currentAreaId = useSelector((state) => state.geoData.activeArea);
  const amenities = useSelector((state) => state.geoData.areas).find(
    (area) => area.id === currentAreaId
  ).amenities;
  const [currentAmenity, setCurrentAmenity] = useState(amenities[0]);
  const mapboxlayer = props.layer.layer;
  const [size, setSize] = useState(2);

  const handleExpandSettings = () => {
    setExpandSettings(!expandSettings);
  };

  const adjustSize = (newSize) => {
    setSize(newSize);
    dispatch(changeSize({ id: mapboxlayer.id, size: newSize }));
  };

  const handleToggleChange = (selected) => {
    if (selected !== null) {
      setCurrentAmenity(selected);
      dispatch(
        setWayNodeLayerProperty({
          id: mapboxlayer.id,
          selected: `${numPois}_${selected}`,
        })
      );
    }
  };

  const handleNumPoiChange = (event, val) => {
    if (val !== null) {
      setNumPois(val);
      dispatch(
        setWayNodeLayerProperty({
          id: mapboxlayer.id,
          selected: `${val}_${currentAmenity}`,
        })
      );
    }
  };
  return (
    <>
      <LayerToggle
        layer={props.layer}
        label="Distance to nearest..."
        icon={<GrainOutlined />}
        onExpand={handleExpandSettings}
      />
      <Collapse in={expandSettings}>
        <Container>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Rating
                emptyIcon={<PlaceOutlinedIcon sx={{ color: "gray" }} />}
                icon={<PlaceIcon />}
                value={numPois}
                onChange={handleNumPoiChange}
              ></Rating>
            </Grid>
            <Grid item>
                <Box sx={{display: "flex"}}>
            <FormControl sx={{width:"50%"}}>
            <Select variant="standard" defaultOpen={false} defaultValue={currentAmenity} value={currentAmenity} onChange={(e) => handleToggleChange(e.target.value)} sx={{width:"100%"}}>
            {amenities.map((amenity) => <MenuItem key={amenity} value={amenity}> {amenity} </MenuItem>)}
            </Select>
            </FormControl>

                </Box>
              
            </Grid>

            <Grid item>
            <Slider
                aria-label="Small steps"
                onChange={(e) => adjustSize(e.target.value)}
                defaultValue={1}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="auto"
            />
            </Grid>
          </Grid>
        </Container>
      </Collapse>
    </>
  );
}

export default NodeLayerItem;
