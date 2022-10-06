import SendIcon from '@mui/icons-material/Send';
import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAmenities, addPolygon, addSource, clearSources } from "../reducers/geoDataReducer";
import { addLayer, clearLayers } from "../reducers/layerReducers";
import { resetQueries } from "../reducers/mapSlice";
import { average, calcHexagons, reduceHexagons, scoreHexagons } from "../utils/hexFunctions";

function MapPolySearch(props) {

  const dispatch = useDispatch();
  const mapsettings = useSelector((state) => state.mapSettings);
  const area = useSelector((state) => state.geoData.sources).find((el) => el.source.id === props.areaId)
  const requestData = {
    ...mapsettings,
    geometry : area.source.data,
    areaId : props.areaId
  }

  async function fetchRequest() {
    const params = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include"
    };
    const [fa, po] = await Promise.all([
      fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/nearest-query/`, params),
      fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/pois/`, params),
    ]);
    const waynodes_fast = await fa.json();
    const pois = await po.json();
    return [waynodes_fast, pois];
  }
  
  async function getData() {
    props.onClick()
    dispatch(clearLayers(props.areaId))
    dispatch(clearSources(props.areaId))
    const [waynodes_fast, pois] = await fetchRequest()
    const amenities = mapsettings.queries.map((query) => query.amenity)
    
    dispatch(addPolygon(mapsettings.geometry))
    dispatch(addSource({areaId: props.areaId, sourceType: "waynodes", data: waynodes_fast}))
    dispatch(addSource({areaId: props.areaId, sourceType: "pois", data: pois}))
    const collected = calcHexagons(waynodes_fast, requestData.geometry, 1, amenities)
    const reducedData = reduceHexagons(collected, average)
    const scoredData = scoreHexagons(reducedData, amenities, average)
    dispatch(addSource({areaId: props.areaId, sourceType: "hex", data: scoredData}))
    dispatch(addAmenities({areaId: props.areaId, amenities: amenities}))
    dispatch(addLayer({areaId: props.areaId, type: "point", property: `1_${amenities[0]}`}))
    dispatch(addLayer({areaId: props.areaId, type: "hex", property: "score", name: "hexagon"}))
    dispatch(addLayer({areaId: props.areaId, type: "symbol", property: amenities[0] }))
    dispatch(resetQueries())
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => {
        getData();
      }}
      startIcon={<SendIcon />}
    >
      Run Query
    </Button>
  );
}

export default MapPolySearch;
