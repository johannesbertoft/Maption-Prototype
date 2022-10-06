import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import { Button, Checkbox, Container, Drawer, FormControlLabel, Grid, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExistingAmenities } from "../reducers/mapSlice";
import AmenitySelectorTable from "./AmenitySelectorTable";
import MapPolySearch from "./MapPolySearch";
function QueryTool(props) {
  const [state, setState] = React.useState({
    "right": false
  })
  const dispatch = useDispatch();
  const area = useSelector((state) => state.geoData.sources).find(
    (el) => el.source.id === props.areaId
  );
  const pois = useSelector((state)=> state.mapSettings.amenities)
  const toggleDrawer = (anchor, open) => (event) => {
    getAmenities(area);
  
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // const handleClick = () => {
  //   setOpen(true);
  // }

  async function getAmenities() {
    const amenities = await fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/amenities/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(area.source.data),
    }).then((response) => response.json());

    dispatch(
      updateExistingAmenities({
        amenities: amenities,
      })
    );
  }

  return (
    <div>
      <Box>
        {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
          color="primary"
          variant="contained"
          onClick={toggleDrawer(anchor, true)}
          startIcon={<AddIcon />}
        >
          New Query
        </Button>
        <Drawer
          open={state[anchor]}
          anchor={anchor}
          onClose={toggleDrawer(anchor, false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Container
            mb={2}
            sx={{width:420}}
            // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
          >
            <IconButton onClick={toggleDrawer(anchor, false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
            ></Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
            ></Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>

                <AmenitySelectorTable area={area} />
              </Grid>
              <Grid item xs={12}>
                <MapPolySearch areaId={props.areaId} onClick={toggleDrawer(anchor, false)} />

              </Grid>
            </Grid>

            <form>
              {pois.map(poi => {<FormControlLabel
              label={poi}
              control={
                <Checkbox
                  checked={true}

                />
              }>

              </FormControlLabel>})
            } 
            </form>
          </Container>
        </Drawer>
        </React.Fragment>
    ))}
      </Box>
    </div>
  );
}

export default QueryTool;
