import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { userData } from '../contexts/userprofile';
import { useHistory } from 'react-router-dom';
import { axiosInstance } from '../util/config';
import {Link} from "react-router-dom";

export default function ButtonAppBar() {

    const history = useHistory();   
    
    async function refresh(){
      await axiosInstance.get("/isUserAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
      }}).then((Response) => {
      if(Response.data.auth === true){
        // history.push('/Home'); 
        userData.setStatus(Response.data.auth);
        userData.setRole(Response.data.Role);
      }
      })
    }

    function login() {
        history.push('/');
        window.location.reload();
    }
  
    function logout() {
        localStorage.removeItem("token");
        userData.setStatus(false);
        userData.setRole(-1);
        history.push('/');
        window.location.reload();
       }

    React.useEffect(() => {
        refresh();
      }, []);

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img src='./logo.png' width="50" height="50" />
            </Typography>
              {
              (userData.getRole()===0 || userData.getRole()===1) &&  <Link to="/Home"><Button color="inherit">Home</Button></Link>
              }
              {
              (userData.getRole()===0) && <Link to="/Admins"><Button color="inherit">Admins</Button></Link>
              }
              {
              (userData.getRole()===0) && <Link to="/Guards"><Button color="inherit">Guards</Button></Link>
              }
              {
              (userData.getRole()===0 || userData.getRole()===1) &&  <Link to="/Students"><Button color="inherit">Students</Button></Link>
              }
              {
              (userData.getStatus()===false) && <Button color="inherit" onClick={() => login()}>Login</Button>
              }
              {
              (userData.getStatus()===true) && <Button color="inherit" onClick={() => logout()}>Sign Out</Button>
              }
          </Toolbar>
        </AppBar>
      </Box>
    );
}
