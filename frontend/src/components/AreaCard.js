import LocationCity from "@mui/icons-material/LocationCity";
import {
  Card,
  CardHeader,
  CardContent
} from "@mui/material";
import { useSelector } from "react-redux";
import SelectArea from "./SelectArea";
import QueryTool from "./QueryTool";

function AreaCard(props) {
  const area = useSelector((state) => state.geoData.areas).find(area => area.id === props.areaId)
  return (
      <Card sx={{backgroundColor:'#F1F3F1'}}>
        <CardHeader 
            title={<SelectArea onSelect={props.onSelect}></SelectArea>} 
            subheader={`${area.centerPoint.coordinates[0]} E, ${area.centerPoint.coordinates[1]} N, Denmark`} 
            avatar={<LocationCity/>}>
        </CardHeader>
        <CardContent>
          <QueryTool areaId={props.areaId}></QueryTool>
        </CardContent>
      </Card>
  );
}

export default AreaCard;
