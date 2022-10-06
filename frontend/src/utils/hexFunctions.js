
import * as turf from '@turf/turf';

var features = turf.featureCollection([
  turf.point([26, 37], {foo: 2, hello: 3}),
  turf.point([36, 53], {foo: 100, hello: 4})
]);

function calcFeatureValue(waynodes, distanceProps, aggFunc) {
    let collected = {...waynodes}
    turf.propEach(collected, props => {
      const properties = Object.entries(props).filter(([key, val]) => distanceProps.includes(key)).map(([key,val])=> val)
      props.value = "hello"
    });
    return collected
  }

function calcHexagons(waynodes, poly, size, amenities) {
    const bbox = turf.bbox(poly)
    const hexgrid = turf.hexGrid(bbox, size/10)
    const collected = amenities.reduce((previous, current) => {
      let coll = turf.collect(previous, waynodes, `nearest 1_${current}`, `nearest ${current}`);
      return coll
    }, hexgrid);
    collected.features = collected.features.filter(feat => feat.properties[`nearest ${amenities[0]}`].length)
    return collected
}

function reduceHexagons(hexData, aggFunc, aggFuncLabel) {
    const data = {...hexData}
    turf.propEach(data, props =>{
      const propertyLists = Object.entries(props)
      propertyLists.forEach(([key, val]) => props[key] = aggFunc(val))
    })
    return data
}

function scoreHexagons(hexData, selectAmenities, aggFunc) {
  const data = {...hexData}
  turf.propEach(data, props => {
    const amenities = Object.entries(props)
    const vals = amenities.map(([key, val]) => val)
    props.score = aggFunc(vals)
  })
  return data
}


const average = (properties) => properties.reduce((acc, val) => acc+val, 0) / properties.length
const max = (properties) => properties.reduce((acc, val) => Math.max(acc, val))


export { calcFeatureValue, calcHexagons, reduceHexagons, scoreHexagons, average, max };
