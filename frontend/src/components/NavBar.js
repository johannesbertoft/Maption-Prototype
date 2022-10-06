import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import MapMenu from './MapMenu';

export default function DenseAppBar({changeTheme}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="primary" position="static">
        <Toolbar variant="dense">
          <MapMenu changeTheme={changeTheme}/>
          <Typography fontFamily="Futura" variant="h6" color="inherit" component="div">
            Maption
          </Typography>
        
        </Toolbar>
      </AppBar>
    </Box>
  );
}


