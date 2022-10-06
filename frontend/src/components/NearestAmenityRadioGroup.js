import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";
import { useSelector } from "react-redux";

function NearestAmenityRadioGroup() {
  const amenities = useSelector((state) => state.layerReducers.amenities);
  
  const [value, setValue] = useState(amenities[0]);

  const handleChange = (event) => {
    // Set which property the layer should use for coloring,
    setValue(event.target.value);
    
  };


  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Distance to nearest amenities</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
    {amenities.map((amenity) => <FormControlLabel key={amenity} value={amenity} control={<Radio/>} label={`nearest ${amenity}`}></FormControlLabel>)}
      </RadioGroup>
    </FormControl>
  );
}


export default NearestAmenityRadioGroup