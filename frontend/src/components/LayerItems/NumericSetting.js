import { Typography, Slider, Box, Container } from '@mui/material'
import React from 'react'
import LabelImportantOutlinedIcon from '@mui/icons-material/LabelImportantOutlined';

function NumericSetting({label, onChange}) {

const handleNumericChange = (val) => {
    onChange(val);
}
  return (
    <Box >
        <Box sx={{display:"flex"}}>
        <LabelImportantOutlinedIcon color="secondary"></LabelImportantOutlinedIcon>
        <Typography>
        {label}
        </Typography>
    
        </Box>
        <Container>
        <Slider
                aria-label="Small steps"
                onChange={(e) => handleNumericChange(e.target.value)}
                defaultValue={1}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="auto"
            >
        </Slider>
        </Container>
    </Box>

    
  )
}

export default NumericSetting