import PolylineIcon from '@mui/icons-material/Polyline';
import { Collapse, Container } from '@mui/material';
import React, { useState } from 'react';
import LayerToggle from '../LayerToggle';
import NumericSetting from './NumericSetting';

function StreetsLayerItem(props) {
    const [expandSettings, setExpandSettings] = useState(false)

    const handleExpandSettings = () => {
        setExpandSettings(!expandSettings)
    }
    
    const adjustLineSize = (val) => {
        // Not implemented
    }
    return (
        <>
        <LayerToggle layer={props.layer} label="Street network" icon={<PolylineIcon/>} onExpand={handleExpandSettings}/>
        <Collapse in={expandSettings}>
            <Container>
            <NumericSetting label="line-width" onChange={adjustLineSize}>
            </NumericSetting>

            </Container>

        </Collapse>
        </>
  )
}

export default StreetsLayerItem