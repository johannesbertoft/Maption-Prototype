import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useControl } from "react-map-gl";

function GeoCoder(props) {
    const geocoder = new MapboxGeocoder({accessToken:props.token, marker:false});
    useControl(() => geocoder, {
      position: "top-left"
      });
    return null;
  }

export { GeoCoder };

