import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { Box, Card, CardHeader, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';
function ColorLegend({layer}) {

    var color = (function(type) {
        switch(type) {
          case 'line':
            return layer.layer.paint["line-color"];
          case 'fill':
            return layer.layer.paint["fill-color"];
            case "point":
            return layer.layer.paint["circle-color"];
          default:
            return 30;
        }
      })(layer.layer.type);
      
    const legend = typeof color === "string" ? 
        <ListItem>
            <ListItemIcon >
                <SquareRoundedIcon sx={{color:color}}/>
            </ListItemIcon>
            <ListItemText>
                {layer.layer.type}
            </ListItemText>
        </ListItem>
        : 
        <>
        <Box sx={{display:"flex"}}>
        <Box>
        <ListItem>
            <ListItemIcon>
                <SquareRoundedIcon sx={{ color:color[4]}}/>
            </ListItemIcon>
            <ListItemText>
                {`< ${color[5]}`}
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <SquareRoundedIcon sx={{ color:color[6]}}/>
            </ListItemIcon>
            <ListItemText>
                {`${color[5]} - ${color[7]}`}
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <SquareRoundedIcon sx={{ color:color[8]}}/>
            </ListItemIcon>
            <ListItemText>
                {`${color[7]} - ${color[9]}`}
            </ListItemText>
        </ListItem>
        </Box>
        <Box>
        <ListItem>
            <ListItemIcon>
                <SquareRoundedIcon sx={{ color:color[10]}}/>
            </ListItemIcon>
            <ListItemText>
                {`${color[9]} - ${color[11]}`}
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <SquareRoundedIcon sx={{ color:color[12]}}/>
            </ListItemIcon>
            <ListItemText>
                {`${color[11]} - ${color[13]}`}
            </ListItemText>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <SquareRoundedIcon sx={{ color:color[14]}}/>
            </ListItemIcon>
            <ListItemText>
                {`> ${color[13]}`}
            </ListItemText>
        </ListItem>
        </Box>
        </Box>
        
        
        </>
        
  return (
    <Card sx={{backgroundColor:'#F1F3F1'}}>
        <CardHeader
        avatar={<DirectionsWalkIcon></DirectionsWalkIcon>}
        subheader={"Walking distance (meters)"}
        >
            
        </CardHeader>
        <Typography>
        </Typography>
        <List dense>
            {legend}
        </List>
        <Divider/>
    </Card>
  )
}

export default ColorLegend