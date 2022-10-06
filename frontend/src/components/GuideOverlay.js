
import { Fab } from "@mui/material";
import Grow from '@mui/material/Grow';
import Modal from "@mui/material/Modal";
import Typography from '@mui/material/Typography';
import { Box } from "@mui/system";
import { useState } from "react";






function GuideOverlayer(){

    const [box, setBox] = useState(true);
    const [draw, setDraw] = useState(false);
    const [create, setCreate] = useState(false);
    const [layer,setLayer] = useState(false)



  
  
      

    const boxStyle = {
        position: "absolute",
        top: "15%",
        left: "40%",
        width: "23%",
        display: "flex",
        flexDirection: "column",
        //backgroundColor: "white",
        backgroundColor: 'transparent',
        outline: 'none',
        p: 4,
    };
     
    

   
    const layerStyle = {
        position: "absolute",
        top: "-13%",
        left: "80%",
        outline: 'none',
        p: 4,
        
      };




    const createStyle = {
        position: "absolute",
        top: "68%",
        left: "7%",
        outline: 'none',
        p: 4,
        
      };
      

      const tourStyle = {
        position: "absolute",
        top: "12%",
        left: "5%",
      
      };

      const noThanksStyle = {
        position: "absolute",
        top: "12%",
        left: "50%",
      
      };



const drawStyle = {
  position: "absolute",
  top: "12%",
  left: "5%",
  outline: 'none',
        p: 4,
  

};

const imgStyle = {
    position: "absolute",
    top: "12%",
    left: "8%",
    height : "100px"
}    


    return (
        <div>

        {box && (<Modal
        sx={{ border: 'none' }}
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

      <Box  style={boxStyle}>

      <Grow in={true}>{         <Fab  color="primary" variant="extended" onClick={() => {setBox(false); setDraw(true);}} style={tourStyle}> Take a tour </Fab> 
}</Grow>
  {/* Conditionally applies the timeout prop to change the entry speed. */}
  <Grow
    in={true}
    style={{ transformOrigin: '0 0 0' }}
    {...(true ? { timeout: 1300 } : {})}
  >
    {         <Fab  variant="extended" onClick={() => {setBox(false);setDraw(false);}} style={noThanksStyle}> no thanks </Fab> 
}
  </Grow>


 

         </Box>
      </Modal>)}

    
        <Modal
          sx={{ border: 'none' }}
          open={draw}
          onClose={() => {
            setDraw(false);
            setCreate(true)
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
           <Typography style={drawStyle} variant="h6" color="gold" component="div">
        <img style={imgStyle} src={require("../images/arrow.png")}/>
        Click here to draw an area
          </Typography>
        </Modal>



        {!draw && <Modal
       
        style={createStyle}
          open={create}
          onClose={() => {
            setCreate(false);
            setLayer(true)
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
           <Typography style={drawStyle} variant="h6" color="gold" component="div">
        <img style={imgStyle} src={require("../images/arrow.png")}/>
        Click here save your area
          </Typography>
        </Modal> }

       {!create && <Modal
        style={layerStyle}
          open={layer}
          onClose={() => {
            setLayer(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
           <Typography style={drawStyle} variant="h6" color="gold" component="div">
        <img style={imgStyle} src={require("../images/arrow.png")}/>
        access your areas and add layers 
          </Typography>
        </Modal>  }

        </div>

        
      );


}
 export default GuideOverlayer