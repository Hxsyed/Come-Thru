import * as React from 'react';
import './Style.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { axiosInstance } from '../util/config';
import { userData } from '../contexts/userprofile';
import { useHistory } from 'react-router-dom';

export default function BasicTable() {
    const history = useHistory();
    const [Admins, setAdmins] = React.useState([]);
    if(userData.getStatus()===false){
        history.push('/'); 
      }
      
    async function getStudents(){
    await axiosInstance.get("/getAdmins").then((Response) => {
        setAdmins(Response.data);
        })
    }

    function deleteAdmin(user ){
        axiosInstance.post("/deleteAdmin",{
            Adminuser: user,
            }).then((Response) => {
            alert(Response.data.message);
            });
        }

    React.useEffect(() => {
        getStudents();
      }, []);

    return (
        <Grid container className = 'main' direction="row" spacing={0}>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Role</TableCell>
                {
                (userData.getRole()===0) &&  <TableCell align="right"></TableCell>
                }
            </TableRow>
            </TableHead>
            <TableBody>
            {Admins.map((admin) => (
                <TableRow>
                <TableCell component="th" scope="row">
                    {admin.user}
                </TableCell>
                <TableCell align="right">{admin.role}</TableCell>
                {
                    (userData.getRole()===0) &&  <TableCell align="right"><Button variant="contained" color="error" onClick={() => deleteAdmin(admin.user)}>X</Button></TableCell>
                }
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        </Grid>
    );
}
