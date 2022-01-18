import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { axiosInstance } from '../util/config';
import { userData } from '../contexts/userprofile';

export default function BasicTable() {
    const [Students, setStudents] = React.useState([]);

    async function getStudents(){
    await axiosInstance.get("/getStudents").then((Response) => {
        setStudents(Response.data);
        })
    }
    function deleteStudent(EMPLID ){
    axiosInstance.post("/deleteStudent",{
        EMPLID: EMPLID,
        }).then((Response) => {
        alert(Response.data.message);
        });
    }

    React.useEffect(() => {
        getStudents();
      }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Vaccination Status</TableCell>
            <TableCell align="right">EMPL ID</TableCell>
            {
            (userData.getRole()===0) &&  <TableCell align="right"></TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {Students.map((student) => (
            <TableRow>
              <TableCell component="th" scope="row">
                {student.First_name}
              </TableCell>
              <TableCell align="right">{student.Last_name}</TableCell>
              <TableCell align="right">{student.Email}</TableCell>
              <TableCell align="right">{student.Vaccination}</TableCell>
              <TableCell align="right">{student.EmplID}</TableCell>
              {
                (userData.getRole()===0) &&  <TableCell align="right"><Button color="inherit" onClick={() => deleteStudent(student.EmplID)}>X</Button></TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
