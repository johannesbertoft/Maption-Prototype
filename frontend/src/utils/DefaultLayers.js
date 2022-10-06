const defaultFillLayer = {
  type: "fill",
  paint: {
    "fill-color": "gray",
    "fill-outline-color": "gray",
    "fill-opacity": 0.5,
  },
  layout: {
    "visibility": "visible",
  },
};

const defaultBackGroundLayer = {
  type: "background",
  paint: {
    "background-color": "black",
    "background-opacity": 0,
  },
  layout: {
    "visibility": "visible"
  }
};

const defaultCircleLayer = {
  type: "circle",
  paint: {
    "circle-radius": 3,
    "circle-color": "gray",
    "circle-stroke-color": "white",
    "circle-stroke-width": 0,
    "circle-opacity": 0.5,
  },
  layout: {
    "visibility": "visible",
  },
};


const defaultSymbolLayer = {
  type: "symbol",
  layout: {
    "icon-image": "marker",
    "icon-allow-overlap": true,
    "icon-size": 0.5,
    "visibility": "visible",
  },
};

const defaultLineLayer = {
  type: "line",
  paint: { 
    "line-width": 1, 
    "line-color": "green" 
  },
  layout: {
    visibility: "visible",
  },
};

// const clusterLayer = {
//   id: "clusters",
//   type: "circle",
//   filter: ["has", "point_count"],
//   source: "clustersource",
//   layout: {
//     visibility: "none",
//   },
//   paint: {
//     // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
//     // with three steps to implement three types of circles:
//     //   * Blue, 20px circles when point count is less than 100
//     //   * Yellow, 30px circles when point count is between 100 and 750
//     //   * Pink, 40px circles when point count is greater than or equal to 750
//     "circle-color": [
//       "step",
//       ["get", "point_count"],
//       "#51bbd6",
//       3,
//       "#f1f075",
//       10,
//       "#f28cb1",
//     ],
//     "circle-radius": ["step", ["get", "point_count"], 20, 3, 30, 10, 40],
//     "circle-opacity": 0.7,
//   },
// };

// const clusterPoiCount = {
//   id: "cluster-count",
//   type: "symbol",
//   source: "clustersource",
//   filter: ["has", "point_count"],
//   layout: {
//     "text-field": "{point_count_abbreviated}",
//     "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
//     "text-size": 12,
//   },
// };
export { defaultFillLayer, defaultCircleLayer, defaultBackGroundLayer, defaultLineLayer, defaultSymbolLayer};
