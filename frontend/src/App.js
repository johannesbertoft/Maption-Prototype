import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import React, { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import store from "./store";
import { useSelector, useDispatch } from "react-redux";
import MapMain from "./components/MapMain";
import NavBar from "./components/NavBar";
import "./styles.css";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import GuideOverlayer from './components/GuideOverlay'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#30414b"
    },
    secondary: {
      main: "#DA9C20"
    },
    tonalOffset: 0.2,
    background: {
      default: "#9c9486",
      paper: "#9c9486"
    }, 
    action: {
      active: "#9c948a6"
    }
  },
})

function App() {
  
  const [theme, setTheme] = useState(lightTheme);
  const [mapBoxStyle, setMapBoxStyle] = useState("mapbox://styles/mapbox/light-v10")
  function changeTheme() {
    if (theme === lightTheme) {
      setTheme(darkTheme);
      setMapBoxStyle("mapbox://styles/mapbox/dark-v10");
    }
    else {
      setTheme(lightTheme)
      setMapBoxStyle("mapbox://styles/mapbox/light-v10")
    }
  }

  return (

    <ThemeProvider theme={theme}>
      <NavBar changeTheme={changeTheme}/>
      <GuideOverlayer/>
      <MapMain mapBoxStyle={mapBoxStyle} theme={theme}/>
    </ThemeProvider>

  );
}

export default App;
