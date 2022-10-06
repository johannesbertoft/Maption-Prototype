import { Button, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import uuid from "react-uuid";
import AmenitySelector from "./AmenitySelector";
import AddIcon from '@mui/icons-material/Add';


function AmenitySelectorTable(props) {

  //pull id and remove row
  const pull_id = (id) => {
    const updated = rows.filter((row) => row.id !== id);
    setRows(updated);
  };

  const [rows, setRows] = React.useState([
    <AmenitySelector getId={pull_id} id={uuid()}  area={props.area} />,
  ]);

  const addRow = () => {
    setRows([...rows, <AmenitySelector getId={pull_id} id={uuid()} area={props.area} />]);
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableCell>
            <Typography variant="h5" color="primary">
              Select Amenities
            </Typography>
          </TableCell>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  addRow();
                }}
              >
                Add Amenity
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default AmenitySelectorTable;
