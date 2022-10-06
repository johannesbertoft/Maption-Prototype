import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {
  Box, Card,
  CardContent,
  Collapse,
  Container,
  Grid
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import Map, {
  FullscreenControl,
  Layer,
  NavigationControl,
  Popup,
  Source,
  useControl
} from "react-map-gl";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useDispatch, useSelector } from "react-redux";
import AddAreaAction from "./AddAreaAction";
import AreaCard from "./AreaCard";
import { GeoCoder } from "./GeoCoder.js";
import Layers from "./Layers";
import LegendPanel from "./LegendPanel";

function MapMain({ mapBoxStyle }) {
  const PopupStyle = {
  };

  const [info, setInfo] = useState([]);
  const [layerType, setLayerType] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const [precentages, setPrecentages] = useState([]);

  const draw = new MapboxDraw();
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const mapRef = useRef();
  const activeArea = useSelector((state) => state.geoData.activeArea);
  const currentArea = useSelector((state) => state.geoData.areas).find(
    (area) => area.id === activeArea
  );

  function DrawControl(props) {
    useControl(() => draw, {
      position: "top-left",
      displayControlsDefault: true,
    });
    return null;
  }

  function changeViewPort(coordinates) {
    mapRef.current.flyTo({
      center: coordinates,
    });
  }
  function resizeMap() {
    mapRef.current.resize();
  }

  const [idx, setChecked] = useState(1);

  const loadResources = () => {
    mapRef.current.loadImage(
      "//docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      (error, image) => {
        if (error) throw error;
        mapRef.current.addImage("marker", image);
      }
      )
    }


  const handleNewQuery = (i) => {
    setChecked(idx === 1 ? 0 : 1);
    setTimeout(() => {
      resizeMap();
    }, 300);
  };

  // useEffect(() => {
  //   async function createDefault(defaultArea) {
  //     dispatch(
  //       addArea({
  //         id: defaultArea.id,
  //         data: defaultArea,
  //         name: "Copenhagen-Example",
  //       })
  //     );
  //     dispatch(setActiveArea(defaultArea.id));
  //     const data = await getNetwork(defaultArea);

  //     dispatch(
  //       addSource({ areaId: defaultArea.id, sourceType: "ways", data: data })
  //     );
  //     dispatch(
  //       addLayer({
  //         areaId: defaultArea.id,
  //         id: defaultArea.id,
  //         sourceId: defaultArea.id,
  //         type: "area",
  //       })
  //     );
  //     dispatch(
  //       addLayer({
  //         areaId: defaultArea.id,
  //         id: defaultArea.id,
  //         sourceId: defaultArea.id,
  //         type: "line",
  //       })
  //     );
  //   }
  //   createDefault(copenhagenDefault);
  // }, []);

  const dispatch = useDispatch();
  const sources = useSelector((state) => state.geoData.sources).filter(
    (source) => source.areaId === activeArea
  );
  const renderLayers = useSelector(
    (state) => state.layerReducers.layers
  ).filter((layer) => layer.areaId === activeArea);
  const layerIds = renderLayers.map((layer) => layer.layer.id);
  const lays = renderLayers.map((el) => el.layer)

  function groupBy() {
    let hex = sources.find((layer) => layer.id === "hexsource");
    let hexArray = hex?.data?.features;
    let obj = sources.find((layer) => layer.id === "pois");
    let pois = obj?.data?.features;
    if (pois !== undefined) {
      const result = pois.reduce(function (r, a) {
        r[a.properties.amenity] = r[a.properties.amenity] || [];
        r[a.properties.amenity].push(a);
        return r;
      }, Object.create(null));
      setPrecentages(result);
    }
  }

  useEffect(() => {
    if (sources !== undefined) {
      groupBy();
    }
  }, [sources]);

  function PopUpLogic(evt) {
    const isPois =
      mapRef.current.queryRenderedFeatures(evt.point)[0]?.properties.amenity !=
      undefined;

    var amenity = mapRef?.current
      ?.queryRenderedFeatures(evt.point)
      .find((obj) => {
        return obj?.properties?.amenity != undefined;
      });

    if (sources.length != 0) {
      const features = mapRef.current.queryRenderedFeatures(evt.point);

      if (draw.getMode() != "draw_polygon") {
        if (!isPois && features[0]?.properties.avgDist) {
          setInfo({
            avgDist: features[0].properties.avgDist,
            countNodes: features[0].properties.countNodes,
          });
          setShowPopup(true);
          setLon(evt.lngLat.lng);
          setLat(evt.lngLat.lat);
          setLayerType(isPois);
        } else if (isPois) {
          setInfo(amenity.properties.amenity);
          setShowPopup(true);
          setLon(evt.lngLat.lng);
          setLat(evt.lngLat.lat);
          setLayerType(isPois);
        } else {
          return;
        }
      }
    }
  }
  return (

    <Box sx={{display: "flex" }}>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        sx={{ paddingTop: 1, paddingLeft: 1, paddingRight: 1 }}
      >
        <Grid xs={12} sm={12} md={9} item sx={{ boxShadow: 0, paddingLeft: 0 }}>
          <Box
            sx={{
              height: "78vh",
              boxShadow: 4,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <Map
              onMouseMove={(evt) => {
                PopUpLogic(evt);
              }}
              onLoad={loadResources}
              className="map"
              ref={mapRef}
              initialViewState={{
                longitude: 12.5850847,
                latitude: 55.6869286,
                zoom: 12,
              }}
              minZoom={8}
              maxZoom={20}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle={mapBoxStyle}
              style={{
                width: "100%",
                height: "100%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                marginLeft: 0,
                boxShadow: 20,
              }}
            >
              <GeoCoder token={MAPBOX_TOKEN} />
              <DrawControl
                position="top-left"
                displayControlsDefault={false}
                controls={{
                  polygon: true,
                  trash: true,
                }}
              />
              {showPopup && renderLayers.length != 0 && (
                <Popup
                  longitude={lon}
                  latitude={lat}
                  style={PopupStyle}
                  closeOnClick={true}
                  closeButton={false}
                  closeOnMove={true}
                  anchor={"bottom"}
                  onClose={() => setShowPopup(false)}
                >
                  {layerType && "Info for : " + info}
                </Popup>
              )}
              <NavigationControl />
              <FullscreenControl />
              {sources.map((el) => (
                <Source key={el.source.id} {...el.source} />
              ))}
              {renderLayers.map((el) => (
                <Layer {...el.layer} key={el.layer.id} />
              ))}
            </Map>
            <Card
              sx={{
                display: "flex",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: "#F1F3F1",
              }}
            >
              <CardContent sx={{display:"flex"}}>
                <AddAreaAction draw={draw}></AddAreaAction>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container direction="column" spacing={1}>
              <Grid item>
              {activeArea === "" ? (
                <></>
                ) : (
                  <AreaCard
                  areaId={activeArea}
                  onSelect={(coords) => changeViewPort(coords)}
                  ></AreaCard>
                  )}
              </Grid>
              <Grid item>
                  <LegendPanel layers={renderLayers}></LegendPanel>
              </Grid>
              <Grid item>
              <Card sx={{ backgroundColor: "#F1F3F1", overflowY: "scroll", maxHeight:"415px"}} >
                <Layers areaId={activeArea}></Layers>
              </Card>
              </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Collapse
        in={idx === 0}
        timeout={100}
        orientation="horizontal"
        collapsedSize={0}
      >
        <Container
          sx={{ backgroundColor: "#6B6B6B", width: 300, height: "100vh" }}
        ></Container>
      </Collapse>
    </Box>

  );
}

export default MapMain;
