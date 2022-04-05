import * as React from 'react';
import { useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import validator from 'validator';
import { useHistory } from 'react-router-dom';
import { userData } from '../contexts/userprofile';
import { axiosInstance } from '../util/config';
import Modal from 'react-modal';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default function SignUp() {
    const history = useHistory();
    const [VAX, setVAX] = React.useState('');
    const [dataUri, setDataUri] = useState('');
    const [CameraStatus, setCameraStatus] = React.useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsOpen1, setIsOpen1] = React.useState(false);
    function openModal() {
      setCameraStatus(true)
      setIsOpen(true);
    }
  
    function closeModal() {
      setIsOpen(false);
      handleCameraStop ()
    }

    function openModal1() {
      setIsOpen1(true);
    }
  
    function closeModal1() {
      setIsOpen1(false);
    }
    const handleChange = (event) => {
      setVAX(event.target.value);
    };

    const getRFIDTAG = () => {
    axiosInstance.post("/RFIDRegister",{
    }).then((Response) => {
      console.log(Response);
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    if (!validator.isAlpha(data.get('firstName'))){
        alert("First Name can only contain letters!");
        return
    }
    if (!validator.isAlpha(data.get('lastName'))){
        alert("Last Name can only contain letters!");
        return
    }
    if (!validator.isEmail(data.get('email'))){
        alert("Email can only contain letters and numbers!");
        return
    }
    if (!validator.isNumeric(data.get('EMPLID'))){
        alert("EMPL ID can only contain numbers!");
        return
    }
    register(data.get('firstName'),data.get('lastName'),data.get('email'),data.get('EMPLID'), VAX, dataUri)
  };


  const register = (firstnname,lastname,emailregister,emplregister,vaccinationstatus, profpic) => {
    axiosInstance.post("/register",{
      firstnname: firstnname,
      lastname: lastname, 
      email: emailregister,
      EMPL: emplregister,
      VAXInfo: vaccinationstatus,
      Profilepic: profpic
    }).then((Response) => {
      if(Response.data.err){
        alert("Something went wrong check your field input and try again!");
        history.push('/Home');
        return
      }
      if(Response.data.message){
        alert(Response.data.message);
        history.push('/Home');
        return
      }
    });
  };

  const adminhandleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!validator.isAlpha(data.get('adminusername'))){
        alert("First Name can only contain letters!");
        history.push('/Home');
        return
    }
    if (!validator.isAlpha(data.get('adminpassword'))){
        alert("Password can only contain letters!");
        history.push('/Home');
        return
    }
    registeradmin(data.get('adminusername'),data.get('adminpassword'));
  };

  const registeradmin = (usernameregisteradmmin,passwordregisteradmin) => {
    axiosInstance.post("/registeradmin",{
      adminusername: usernameregisteradmmin,
      adminpassword: passwordregisteradmin,
    }).then((Response) => {
      if(Response.data.err){
        alert("Something went wrong check your field input and try again!");
        history.push('/Home');
        return
      }
      if(Response.data.message){
        alert(Response.data.message);
        history.push('/Home');
        return
      }
    });
  };

  const securityguardhandleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!validator.isAlpha(data.get('securityusername'))){
        alert("Username can only contain letters!");
        // history.push('/Home');
        return
    }
    if (!validator.isAlphanumeric(data.get('securitypassword'))){
        alert("Password can only contain letters and numbers!");
        // history.push('/Home');
        return
    }
    registersecurityguard(data.get('securityusername'),data.get('securitypassword'));
  };

  const registersecurityguard = (usernameregisterguard,passwordregisterguard) => {
    axiosInstance.post("/registerguard",{
      guardusername: usernameregisterguard,
      guardpassword: passwordregisterguard,
    }).then((Response) => {
      if(Response.data.err){
        alert("Something went wrong check your field input and try again!");
        history.push('/Home');
        return
      }
      if(Response.data.message){
        alert(Response.data.message);
        history.push('/Home');
        return
      }
    });
  };
  // Camera Functions
  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    setDataUri(dataUri);
    openModal1();
  }
  function handleCameraStop () {
    // this.setState({ isCameraOpen:false })
    setCameraStatus(false)
    console.log(CameraStatus)
    console.log('handleCameraStop');
  }
  

  return (
    <div>
    {/* <ThemeProvider theme={theme}> */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Registration
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="EMPLID"
                  label="EMPL ID"
                  name="EMPLID"
                />
              </Grid>
            </Grid>
            <Box textAlign='center'>
                <Button
                // type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={openModal}>
                Photo
                </Button>
            </Box>
            <Box textAlign='center'>
                <Button
                // type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={getRFIDTAG}>
                RFID
                </Button>
            </Box>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Vaccination Status</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={VAX}
                label="Age"
                onChange={handleChange}
            >
                <MenuItem id="VAX" value={"1"}>VAX</MenuItem>
                <MenuItem id="VAX" value={"0"}>NOT VAX</MenuItem>
            </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register Student
            </Button>
          </Box>
          {
            ((userData.getStatus()===true) && (userData.getRole()===0)) &&
            <Box component="form" noValidate onSubmit={adminhandleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  name="adminusername"
                  required
                  fullWidth
                  id="adminusername"
                  label="Admin Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="adminpassword"
                  label="Admin Password"
                  name="adminpassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register Admin
            </Button>
          </Box>
          }
          {
            ((userData.getStatus()===true) && (userData.getRole()===0)) &&
            <Box component="form" noValidate onSubmit={securityguardhandleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  name="securityusername"
                  required
                  fullWidth
                  id="securityusername"
                  label="Security Guard Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="securitypassword"
                  label="Security Guard Password"
                  name="securitypassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register Security Guard
            </Button>
          </Box>
          }
        </Box>
      </Container>
    {/* </ThemeProvider> */}
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={customStyles}
    transparent={true}
    contentLabel="Example Modal"
    >
    {CameraStatus===true &&
     <Camera
        onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
        idealResolution = {{width: 100, height: 100}}
        imageType = {IMAGE_TYPES.JPG}
      />
    }
    <button onClick={closeModal}>close</button>
    </Modal>

    <Modal
    isOpen={modalIsOpen1}
    onRequestClose={closeModal1}
    style={customStyles}
    transparent={true}
    contentLabel="Example Modal1"
    >
     <img src={dataUri} />
    <button onClick={closeModal1}>close</button>
    </Modal>
  </div>
  );
}