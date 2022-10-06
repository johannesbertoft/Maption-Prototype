import { useEffect } from "react";
import { useMap } from "react-map-gl";

function ImageLoader() {

  const { current: map } = useMap();
  useEffect(() => {
    map.loadImage(
      "//docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage("marker", image);
      }
    )
  })
    
    return null;
  }

export default ImageLoader