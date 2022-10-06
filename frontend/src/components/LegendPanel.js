import React from 'react';
import ColorLegend from './ColorLegend';
export default function defaultLegendPanel ({layers}) {
    const legendLayer = layers.filter((layer) => layer.layerName === "hexagon")
    return (
      <>
        {legendLayer.map((layer) => (<ColorLegend layer={layer}></ColorLegend>))}
      </>
    );
 
}