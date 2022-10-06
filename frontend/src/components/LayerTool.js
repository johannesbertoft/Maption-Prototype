import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import {
  Autocomplete, Button, Card, CardContent, Dialog, FormControl, FormControlLabel,
  FormLabel, Grid, Radio, RadioGroup, TextField
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLayer } from "../reducers/layerReducers";


function LayerTool(props) {
  const amenities = useSelector((state) => state.layerReducers.amenities)
  const drawSelected = useSelector((state) => state.activateReducers.addAreaBtn);
  const layers = useSelector((state) => state.layerReducers.layers).map((layer) => layer.id);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(false)

  const createLayer = (event) => {
    event.preventDefault();
    const inputs = event.target.elements;
    dispatch(addLayer({areaId: props.areaId, id: inputs.layerName.value, type: inputs.radio.value, property: inputs.property.value}))
    setOpen(false)
  };

  const handleClickOpen = () => {
    setOpen(true);
  }
  const validate = (e) => {
    layers.includes(e.target.value) ? setErr(true) : setErr(false) 
  }

  return (
    <>
    
    <Button variant="outlined" onClick={handleClickOpen}>
      Open
    </Button>
    <Dialog open={open}>
      <form onSubmit={createLayer}>
      <Card style={{ width: "30vw" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField error={err} helperText={err ? "Layer id already exists" : null} name="layerName" onChange={validate} fullWidth label={"Layer name"}/>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
              <RadioGroup name="radio" style={{display:"flex"}}>
              <FormControlLabel value="hex" control={<Radio />} label={<HexagonOutlinedIcon></HexagonOutlinedIcon>} />
              <FormControlLabel value="line" control={<Radio />} label={<PolylineOutlinedIcon></PolylineOutlinedIcon>} />
              <FormControlLabel value="point" control={<Radio />} label={<GrainOutlinedIcon/>}/>
              <FormControlLabel value="symbol" control={<Radio />} label={<RoomOutlinedIcon/>}/>
              </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={amenities}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} name="property" label="Property"/>
                )}
              />
          </Grid>
          <Grid item xs={12}>
              <Button type="submit" fullWidth>
                Add Layer
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
    </Dialog>
    </>
    
    
  );
}

export default LayerTool;
