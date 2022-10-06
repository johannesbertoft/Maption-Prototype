import CreateIcon from "@mui/icons-material/Create";
import { Button, Fab } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addArea, addSource, setActiveArea } from "../reducers/geoDataReducer";
import { addLayer } from "../reducers/layerReducers";

const boxStyle = {
  position: "absolute",
  top: "25%",
  left: "37%",
  height: "fit-content",
  width: "fit-content",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  border: "6px solid grey",
  borderRadius: "10px",
  paddingTop: "1%",
};

const errorStyle = {
  position: "absolute",
  top: "25%",
  left: "37%",
  height: "18%",
  width: "20%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  border: "6px solid grey",
  borderRadius: "10px",
  paddingTop: "1%",
};

const style = {
  position: "absolute",
  top: "25%",
  left: "37%",
  height: "fit-content",
  width: "fit-content",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  border: "6px solid grey",
  borderRadius: "10px",
  paddingTop: "1%",
};

const saveStyle = {
  //top: "120%",
  //right: "60%",
};

function AddAreaAction({ draw, setActive }) {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [prompt, setPrompt] = useState(true);
  const [open, setOpen] = useState(false);
  const [areaName, setAreaName] = useState(false);
  const [save, setSave] = useState(false);
  const [poly, setPoly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [network, setNetwork] = useState(true);
  const [spinner, setSpinner] = useState(false);

  function CircularIndeterminate() {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress thickness={5.5} display={spinner} />
      </Box>
    );
  }

  async function getNetwork(poly) {
    setSpinner(true);
    const data = await fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/network/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        areaId: poly.id,
        geometry: poly,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          setNetwork(false);
          // create error object and reject if not a 2xx response code
          let err = new Error("HTTP status code: " + response.status);
          err.response = response;
          err.status = response.status;
          throw err;
        } else {
          setNetwork(true);
        }
        return response.json();
      })
      .catch((error) => {
        console.log("Api call error");
      });
    setSpinner(false);

    dispatch(addSource({ areaId: poly.id, sourceType: "ways", data: data }));
  }

  const handleChange = (event) => {
    setAreaName(event.target.value);
  };

  function saveAreaName() {
    setSave(true);
    dispatch(addArea({ id: poly.id, data: poly, name: areaName }));
    dispatch(
      addLayer({
        areaId: poly.id,
        id: poly.id,
        sourceId: poly.id,
        type: "area",
      })
    );
    dispatch(
      addLayer({
        areaId: poly.id,
        id: poly.id,
        sourceId: poly.id,
        type: "line",
      })
    );
    dispatch(setActiveArea(poly.id));
    setOpen(false);
    setAreaName(false);

  }

  const handleClickOpen = () => {
    if (draw.getSelected().features.length > 0) {
      setDisabled(false);
      const poly = draw.getSelected().features[0];

      setPoly(poly);
      getNetwork(poly);
      setOpen(true);
    }
  };

  return (
    <>
      <Fab
        color="secondary"
        disabled={disabled}
        variant="extended"
        onClick={handleClickOpen}
      >
        <CreateIcon sx={{ mr: 1 }} />
        Create Area
      </Fab>

      {spinner && (
        <Modal open={true}>
          <Box style={boxStyle}>
            <Typography variant="body2">
              Generating street network...
            </Typography>
            <CircularIndeterminate />
          </Box>
        </Modal>
      )}

      {network && !spinner && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            mb={2}
            style={style}
          >
            <TextField
              onChange={handleChange}
              placeholder="example : My neighbourhood"
              error={!areaName ? true : false}
              color={!areaName ? "error" : "success"}
              id="outlined-error-helper-text"
              label="Area ID"
              defaultValue=" "
              helperText={
                !areaName ? "Area ID is required" : "remember to save"
              }
            />
            <Button
              disabled={!areaName && network ? true : false}
              onClick={saveAreaName}
              type="submit"
              variant="outlined"
              color="success"
              style={saveStyle}
              size={"small"}
            >
              save area Id
            </Button>
          </Box>
        </Modal>
      )}

      {!network && !spinner && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            mb={2}
            style={errorStyle}
          >
            <Grow
              in={true}
              style={{ transformOrigin: "50 20 0" }}
              {...(true ? { timeout: 1000 } : {})}
            >
              <Typography variant="body1">
                No available data for the selected area. Please check current
                map coverage here, and how to make a request for additional
                coverage [link]
              </Typography>
            </Grow>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default AddAreaAction;
