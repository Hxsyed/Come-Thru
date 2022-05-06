import * as React from 'react';
import './admin.css';
import 'react-clock/dist/Clock.css';
import { useState, useEffect} from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validator from 'validator';
import { useHistory } from 'react-router-dom';
import { userData } from '../contexts/userprofile';
import { axiosInstance } from '../util/config';
import ktof from 'kelvin-to-fahrenheit';
import Clock from 'react-live-clock';
import date from 'date-and-time';
import Modal from 'react-modal';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import { makeStyles } from "@material-ui/core/styles";
import 'react-html5-camera-photo/build/css/index.css';
import Glock from 'react-clock';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import zIndex from '@mui/material/styles/zIndex';
const theme = createTheme();
const useStyles = makeStyles({
  container: {
    minHeight: 100,
    fontSize: 30,
    textAlign: "center"
  }
});

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1 
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
const now = new Date();
export default function SignUp() {
    const { data, isLoading, errorMessage } = useOpenWeather({
      key: process.env.REACT_APP_WEATHER_API_KEY,
      lat: '40.7128',
      lon: '-74.0060',
      lang: 'en',
      unit: 'imperial', // values are (metric, standard, imperial)
    }); 
    // console.log(data?.current.time)
    const [value, setValue] = useState(new Date());
    if (data) {
      data.current.date = value.toString()
    } 
      // console.log(data.current.date)
    const classes = useStyles();
    const history = useHistory();
    const [VAX, setVAX] = React.useState('');
    const [regtype, setregtype] = React.useState(3);
    const [dataUri, setDataUri] = useState('');
    const [CameraStatus, setCameraStatus] = React.useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsOpen1, setIsOpen1] = React.useState(false);
    if(userData.getStatus()===false){
      history.push('/'); 
    }
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
    const handleuserChange = (event) => {
      setregtype(event.target.value);
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
  }
  
  useEffect(() => {
      const interval = setInterval(() => setValue(new Date()), 60000);
      return () => {
        clearInterval(interval);
      };
  }, [])
  return (
    <Grid container className = 'main' direction="row" spacing={0}>
          <Grid className="div-1" item xs>
            <div className={classes.container}></div>
          </Grid>
      
          <Grid className='daddymd' item xs>
          <div className={classes.container}>
            <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" className='admin-container'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: "flex", alignItems:'center'}}>
             <ReactWeather
              isLoading={isLoading}
              errorMessage={errorMessage}
              data={data}
              lang="en"
              locationLabel="New York"
              unitsLabels={{ temperature: 'F', windSpeed: 'Km/h' }}
              showForecast = {false}
            />
          </div>
          <Typography component="h1" variant="h5" style={{marginTop:"20px",marginBottom:"20px"}}>
            Registration
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            { (userData.getRole()===0) &&
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={regtype}
              label="Age"
              onChange={handleuserChange}
            >
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Guard</MenuItem>
              <MenuItem value={3}>Student</MenuItem>
            </Select>
            }
            { (userData.getRole()===1) &&
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={regtype}
              label="Age"
              onChange={handleuserChange}
            >
              <MenuItem value={3}>Student</MenuItem>
            </Select>
            }
          </FormControl>
          {
            ((userData.getStatus()===true) && (regtype===3)) &&
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
          }
          {
            ((userData.getStatus()===true) && (userData.getRole()===0) && (regtype===1)) &&
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
            ((userData.getStatus()===true) && (userData.getRole()===0) && (regtype===2)) &&
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
          idealResolution = {{width: 600, height: 350}}
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
        </ThemeProvider>
          </div>
        </Grid>
      <Grid className="div-2"item xs>
        <div className={classes.container} ></div>
      </Grid>
    </Grid>
  );
}