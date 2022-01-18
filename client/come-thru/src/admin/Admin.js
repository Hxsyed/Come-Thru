import * as React from 'react';
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


const theme = createTheme();

export default function SignUp() {
    const history = useHistory();
    const [VAX, setVAX] = React.useState('');
    const handleChange = (event) => {
      console.log(event.target.value)
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
    console.log(data.get('firstName'));
    console.log(data.get('lastName'));
    console.log(data.get('email'));
    console.log(data.get('EMPLID').length);
    console.log(VAX);
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
    if (validator.isEmpty(VAX)){
        alert("Please select a vaccination status!");
        return
    }
    register(data.get('firstName'),data.get('lastName'),data.get('email'),data.get('EMPLID'), VAX)
  };


  const register = (firstnname,lastname,emailregister,emplregister,vaccinationstatus) => {
    console.log("I am here")
    axiosInstance.post("/register",{
      firstnname: firstnname,
      lastname: lastname, 
      email: emailregister,
      EMPL: emplregister,
      VAXInfo: vaccinationstatus,
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
    // eslint-disable-next-line no-console
    console.log(data.get('adminusername'));
    console.log(data.get('adminpassword'));
    if (!validator.isAlpha(data.get('adminusername'))){
        alert("First Name can only contain letters!");
        history.push('/Home');
        return
    }
    if (!validator.isAlpha(data.get('adminpassword'))){
        alert("First Name can only contain letters!");
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

  return (
    <ThemeProvider theme={theme}>
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
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={getRFIDTAG}
                >
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
        </Box>
      </Container>
    </ThemeProvider>
  );
}