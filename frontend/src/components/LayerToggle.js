import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  ButtonGroup, IconButton, ListItem,
  ListItemAvatar, ListItemButton, ListItemIcon,
  ListItemText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleLayerVisibility
} from "../reducers/layerReducers.js";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function LayerToggle(props) {
  const dispatch = useDispatch();
  const currentAreaId = useSelector((state) => state.geoData.activeArea);
  const mapboxlayer = props.layer.layer;
  const [selected, setSelected] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setSelected(mapboxlayer.layout.visibility === "visible" ? true : false)
  }, [mapboxlayer])


  const handleExpandClick = () => {
    setExpanded(!expanded);
    props.onExpand();
  };

  const toggleLayer = () => {
    setSelected(!selected);
    dispatch(toggleLayerVisibility({ id: mapboxlayer.id }));
    //
  };

  // const adjustSize = (event, newValue) => {
  //   setSize(newValue);
  //   if (props.layerSource === "clustersource") {
  //     dispatch(
  //       changeClusterSize({
  //         sourceId: mapboxlayer.source,
  //         clusterRadius: newValue * 10,
  //       })
  //     );
  //   } else if (props.layerSource === "hexsource") {
  //     dispatch(
  //       changeHexSize({
  //         sourceId: mapboxlayer.source,
  //         amenity: amenities[0],
  //         hexSize: newValue,
  //       })
  //     );
  //   } else {
  //     dispatch(changeSize({ id: mapboxlayer.id, size: newValue }));
  //   }
  // };

  return (
    // <>
    // https://stackoverflow.com/questions/62391474/have-two-secondary-action-elements-in-a-list
    <ListItem
      sx={{ bgcolor: "#CBD2D3" }}
      disablePadding
      // secondaryAction={
      //   <ButtonGroup>
      //     <IconButton onClick={toggleLayer}>
      //       {selected ? (
      //         <VisibilityOutlinedIcon fontSize="small" />
      //       ) : (
      //         <VisibilityOffOutlinedIcon fontSize="small" />
      //       )}
      //     </IconButton>
      //     <ExpandMore expand={expanded} onClick={handleExpandClick}>
      //       <ExpandMoreIcon></ExpandMoreIcon>
      //     </ExpandMore>
      //   </ButtonGroup>
      // }
    >
      <ListItemButton onClick={handleExpandClick}>
        <ListItemAvatar>
          <ListItemIcon>{props.icon}</ListItemIcon>
        </ListItemAvatar>
        <ListItemText>{props.label}</ListItemText>
      </ListItemButton>
      <ButtonGroup>
          <IconButton onClick={toggleLayer}>
            {selected ? (
              <VisibilityOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOffOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick}>
            <ExpandMoreIcon></ExpandMoreIcon>
          </ExpandMore>
        </ButtonGroup>
    </ListItem>
  );
}
export default LayerToggle;
