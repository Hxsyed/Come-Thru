import './signin.css'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { userData } from '../contexts/userprofile';
import { axiosInstance } from '../util/config';
import validator from 'validator';

const theme = createTheme();

export default function SignIn() {
  const history = useHistory();
  const [loginstatus, setloginstatus] = React.useState(false)

  const logIn = (usernameSignIn,passwordSignIn) => {
    axiosInstance.post("/login",{
      username: usernameSignIn,
      password: passwordSignIn,
    }).then((Response) => {
      if(Response.data.message){
        setloginstatus(Response.data.message)
        return
      }
      if(Response.data.result.length>0){
        localStorage.setItem("token", Response.data.token)
        if(Response.data.result[0].role === 0){
          // SUPER ADMIN
          alert("Logged in successfully!");
          userData.setStatus(true);
          userData.setRole(0);
          history.push('Home');
          return
        } else{
          // ADMIN
          alert("Logged in successfully!");
          userData.setStatus(true);
          userData.setRole(1);
          history.push('Home');
          return
        }        
      }
    });
  }



  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    // checks for input
    if (!validator.isAlpha(data.get('user'))){
      alert("Username can only contain letters!");
      history.push('/');
      return
    }
    else if(!validator.isAlphanumeric(data.get('password'))){
      alert("Password can only contain letters and numbers!");
      history.push('/');
      return
    } 
    else logIn(data.get('user'), data.get('password'))
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className='sign-in-container'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user"
              label="Username"
              name="user"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}