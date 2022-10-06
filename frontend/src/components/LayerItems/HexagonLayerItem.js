import HexagonOutlined from '@mui/icons-material/HexagonOutlined';
import { Collapse, Container } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { changeHexSize } from '../../reducers/geoDataReducer';
import { average, calcHexagons, reduceHexagons, scoreHexagons } from '../../utils/hexFunctions';
import LayerToggle from '../LayerToggle';
import NumericSetting from './NumericSetting';
function HexagonLayerItem(props) {

    const [expandSettings, setExpandSettings] = useState(false)
    const dispatch = useDispatch();
    const currentAreaId = useSelector((state) => state.geoData.activeArea);
    const amenities = useSelector((state) => state.geoData.areas).find(
      (area) => area.id === currentAreaId
    ).amenities;
    const sources = useSelector((state) => state.geoData.sources);
    const waynodes = sources.find((source) => source.areaId === currentAreaId && source.source.id === `waynodes_${currentAreaId}`).source.data
    const polygon = sources.find((source) => source.areaId === currentAreaId && source.source.id === currentAreaId).source.data
    
    
    const [state, setState] = useState(
        amenities.reduce(function(target, key) {
        target[key] = true;
        return target;
    }, {})
      );
    
      const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
      };
    
    const handleHexSize = (newValue) => {
      const collected = calcHexagons(waynodes, polygon, newValue, amenities)
      const reducedData = reduceHexagons(collected, average)
      const scoredData = scoreHexagons(reducedData, amenities, average)
      dispatch(changeHexSize({area: currentAreaId, data: scoredData}))
    }

    const handleExpandSettings = () => {
        setExpandSettings(!expandSettings)
    }
  return (
    <>
    <LayerToggle layer={props.layer} label="Aggregate Accessibility..." icon={<HexagonOutlined/>} onExpand={handleExpandSettings}/>
    <Collapse in={expandSettings}>
      <Container>
      <NumericSetting label="Hexagon Size" onChange={handleHexSize}>

      </NumericSetting>
      </Container>
      <Box>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormGroup>
                {amenities.map((amenity) => 
                    <FormControlLabel
                    key={amenity}
                    control={
                      <Checkbox checked={state[amenity]} onChange={handleChange} name={amenity} />
                    }
                    label={amenity}
                  />
                )}
            </FormGroup>
        </FormControl>
      </Box>
        
    </Collapse>
    </> 
  )
}

export default HexagonLayerItem