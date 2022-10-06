import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import List from "@mui/material/List";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Switch from "@mui/material/Switch";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetQueries
} from "../reducers/mapSlice";

const style = {
  'fontSize' : 30, 
}

export default function MapMenu({changeTheme}) {

  const [state, setState] = useState({
    menu: false,
  });


  const geometry = useSelector((state) => state.mapSettings.geometry);




  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      //onKeyDown={toggleDrawer(anchor, false)}
    >
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
        <IconButton onClick={toggleDrawer(anchor, true)}>
        <MenuIcon color="secondary" style={style}/>
        </IconButton>

          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>

        </React.Fragment>
      ))}
    </div>
  );
}
