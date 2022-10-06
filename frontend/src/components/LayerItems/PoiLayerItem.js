import React from 'react'
import { Card, Collapse} from '@mui/material'
import LayerToggle from '../LayerToggle'
import { useState } from 'react';
import GrainOutlined from '@mui/icons-material/GrainOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
function NodeLayerItem(props) {

    const [expandSettings, setExpandSettings] = useState(false)

    const handleExpandSettings = () => {
        setExpandSettings(!expandSettings)
    }
  return (
    <>
    <LayerToggle layer={props.layer} label="POI markers" icon={<PlaceOutlined/>} onExpand={handleExpandSettings}/>
    <Collapse in={expandSettings}>
    </Collapse>
    </> 
  )
}

export default NodeLayerItem