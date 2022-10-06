import ClearIcon from '@mui/icons-material/Clear';
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Button, Grid, IconButton } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertAmenity, updateFilters } from "../reducers/mapSlice";
const style = {
  position: "absolute",
  top: "20%",
  left: "30%",
  height: "400px",
  width: "500px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#F1F3F1",
  color: "#F1F3F1",
  border: "5px solid grey",
  overflow: "hidden",
  overflowY: "scroll",
};

const TagStyle = {
  position: "absolute",
  top: "10%",
  left: "5%",
  height: "400px",
};

const TagOptionStyle = {
  position: "absolute",
  top: "30%",
  left: "5%",
  height: "400px",
};

function AmenitySelector(props) {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const [amenity, setAmenity] = React.useState("");

  const [tags, setTags] = useState([]);

  const [selectedTag, setSelectedTag] = useState("");

  const [selectedTagOption, setSelectedTagOption] = useState("");

  const geometry = useSelector((state) => state.mapSettings.geometry);

  async function getTags(geometry, amenity) {
    const payload = { geometry, amenity };
    
    const actualData = await fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/tags/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }).then((response) => response.json());
    
    setTags(actualData);
  }

  function handleClose() {
    setOpen(false);
    if (selectedTagOption.length !== 0){
      dispatch(
        updateFilters({
          amenity: amenity,
          filter: { [selectedTag]: selectedTagOption },
        })
      );
    }
    
  }

  const data = useSelector((state) => state.mapSettings.amenities);

  function toggleFilter() {
    setOpen(true);

    getTags(props.area.source.data, amenity);
  }

  function TagList() {
    function TagOptions() {
      useEffect(() => {
        
        if (selectedTag !== "") {
          
          
          getTagOption(props.area.source.data, amenity, selectedTag);
        }
      }, [selectedTag]);

      const [tagOptions, setTagOptions] = useState([]);

      async function getTagOption(geometry, amenity, tag) {
        const payload = { geometry, amenity, tag };
        const actualData = await fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/tagValues/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }).then((response) => response.json());
        
        setTagOptions(actualData);
      }
      return (
        <Autocomplete
          value={selectedTagOption}
          onChange={(event, newValue) => {
            
            setSelectedTagOption(newValue);
          }}
          style={TagOptionStyle}
          disablePortal
          id="combo-box-demo"
          options={tagOptions}
          sx={{ width: 300, top: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Tag options" />
          )}
        />
      );
    }

    return (
      <>
        <Autocomplete
          value={selectedTag}
          onInputChange={(event, newValue) => {
            setSelectedTag(newValue);
          }}
          disablePortal
          id="combo-box-demo"
          options={tags}
          sx={{ width: 300, top: 200 }}
          renderInput={(params) => <TextField {...params} label="Tags" />}
          style={TagStyle}
        />
        <TagOptions amenity={amenity} tag={selectedTag} />
      </>
    );
  }

  function FilterBox() {
    return (
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
          // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
          style={style}
          sx={{backgroundColor:'#F1F3F1'}}
        >
          <TagList amenity={amenity} />
          <Button contained color="primary" onClick={handleClose}> Apply</Button>
        </Box>
      </Modal>
    );
  }

  function FilterButton() {
    const filterStyle = {
      backgroundColor: amenity === "" ? "#ff704d" : "#80ff80",
    };

    return (
      <IconButton
        style={filterStyle}
        onClick={toggleFilter}
        status={"#e53e3e"}
        color="primary"
        disabled={amenity === ""}
      >
        <FilterAltOutlinedIcon fontSize="small" color="action" />
      </IconButton>
    );
  }

  const removeRow = () => {
    props.getId(props.id);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={10}>
      <Autocomplete
        value={amenity}
        onChange={(event, newValue) => {
          if(newValue){
            setAmenity(newValue);
            dispatch(insertAmenity({ amenity: newValue, filter: {} }))
          }
        }}
        disablePortal
        id="combo-box-demo"
        options={data}
        renderInput={(params) => (
          <TextField {...params} label="Select an amenity" />
        )}
      />
      </Grid>
      <Grid item xs={1}>

      <FilterButton />
      <FilterBox />
      </Grid>
      <Grid item xs={1}>
      <IconButton
        //style={removeStyle}
        onClick={() => {
          removeRow();
        }}
      >
        <ClearIcon color="primary" />
      </IconButton>
      </Grid>
      
    </Grid>
  );
}
export default AmenitySelector;
