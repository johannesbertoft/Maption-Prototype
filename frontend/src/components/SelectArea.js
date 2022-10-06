import {
  FormControl,
  InputLabel,
  MenuItem, Select
} from "@mui/material"
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveArea } from '../reducers/geoDataReducer'


function SelectArea(props) {
    const dispatch = useDispatch()
    const areas = useSelector((state) => state.geoData.areas)
    const currentArea = useSelector((state) => state.geoData.activeArea)

    const handleActivateArea = (id) => {
        dispatch(setActiveArea(id))
        const centerPoint = areas.find(area => area.id === id).centerPoint
        props.onSelect(centerPoint.coordinates)
    }

  return (
    <FormControl sx={{width:"100%"}}>

      <Select variant="standard" defaultOpen={false} defaultValue={props.defaultValue} value={currentArea} onChange={(e) => handleActivateArea(e.target.value)} sx={{width:"100%"}}>
        {areas.map((area) => <MenuItem key={area.id} value={area.id}> {area.areaName} </MenuItem>)}
      </Select>
     </FormControl>
  )
}

export default SelectArea