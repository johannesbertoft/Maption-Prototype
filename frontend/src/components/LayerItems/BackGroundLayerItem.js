import Wallpaper from '@mui/icons-material/Wallpaper';
import { Collapse, Container } from '@mui/material';
import { useState } from 'react';
import LayerToggle from '../LayerToggle';
import NumericSetting from './NumericSetting';
function BackGroundLayerItem(props) {
    const [expandSettings, setExpandSettings] = useState(false)

    const handleExpandSettings = () => {
        setExpandSettings(!expandSettings)
    }

    const changeStrokeWidth = (val) => {
    }

    // More settings functions..
  return (
    <>
    <LayerToggle layer={props.layer} label="Background Area" icon={<Wallpaper/>} onExpand={handleExpandSettings}/>
    <Collapse in={expandSettings}>
      <Container>
      <NumericSetting label="stroke-width" onChange={changeStrokeWidth}>

      </NumericSetting>
      </Container>
        
    </Collapse>
    </>
  )
}

export default BackGroundLayerItem