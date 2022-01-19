const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {spawn} = require('child_process');
const saltRounds = 10;

require('dotenv').config()

const app = express();
app.use(express.json()); 
app.use(cors());

const corsOptions ={
    origin: process.env.HEROKU_LINK, 
    methods: 'GET,POST,PATCH,DELETE,OPTIONS,PUT',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

 app.use(cors(corsOptions)) // Use this after the variable declaration
 
const db = mysql.createPool({
    host: process.env.HOST,       
    user: process.env.USER,         
    password: process.env.DATABASE_PASSWORD,  
    database: process.env.DATABASE_NAME       
 })


app.get('/getStudents', (req, res) => {
db.query("SELECT * FROM users;", (err, results) => {
    if(err) throw err;
    res.send(results);
});
});

app.get('/getAdmins', (req, res) => {
db.query("SELECT * FROM admins;", (err, results) => {
    if(err) throw err;
    res.send(results);
});
});

const verifyJWT = (req, res, next) => {
    const token  = req.headers["x-access-token"];

    if(!token){
        res.send("YO, we need a token, send to me next time!");
    }
    else{
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if(err){
                res.json({auth:false, message: "You have failed to properly authenticate"});
            }
            else{
                req.userId = decoded.id;
                req.userRole = decoded.role;
                next();
            }
        })
    }
}

app.get("/isUserAuth", verifyJWT, (req, res) => {
    res.json({auth: true, Role: req.userRole})
})

app.post("/login",(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username,password);
    console.log("Hello World");
    db.query("SELECT * FROM admins WHERE user = ?;",
    username,
    (err,result) => {
        if(err){
            res.send({err: err});
        }
        console.log({result});
        if(result.length>0){ 
            bcrypt.compare(password,result[0].password, (err,response) => {
                if(response){
                    const id = result[0].id;
                    const role = result[0].role;
                    const token  = jwt.sign({id, role}, process.env.JWT_SECRET, {
                        expiresIn: 3600,
                    })
                    res.json({auth: true, token: token, result: result})
                }
                else{
                    res.json({auth: false, message: "Wrong username/password please try again!"});
                }
            })
        }
        else{
            res.json({auth: false, message: "No such user exist!"});
        }
    })
})

function validateuser(EMPL){
    // check if the user already exist
    return new Promise((resolve, reject) => {
        db.query("SELECT EmplID FROM users WHERE EmplID = ?;",
        EMPL,
        (err,result) => {
            if(err){
                // res.send({err: err});
                console.log(err);
            }
            if(result){ 
                if(result.length===0){
                    reject(false);
                   }
                else resolve(true);
            }
        })
      });
}


app.post("/register",async(req,res) => {
    const firstname = req.body.firstnname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const EMPL = req.body.EMPL;
    const VAXInfo = req.body.VAXInfo;

    try {
        var val = await validateuser(EMPL);
        console.log(val)
      } catch (err) {
        console.log(err);
      }
    if(val){
        res.send({message: "User with given EMPL already exist!"});
    }
    else{
        db.query("INSERT INTO users (RFID,First_name,Last_name,Email,Vaccination, EmplID) VALUES (?,?,?,?,?,?)",
        [Math.random() * (1000000 - 0) + 0, firstname,lastname,email, VAXInfo, EMPL], 
        (err,result) => {
            if (err) {
                //If error
                res.send({err: err});
                console.log(err);
            } 
            else{
                //If success
            res.send({message: "Registration completed successsfully!"});
            //  console.log(result);
            }
        })
    }
})

function validateadmin(username){
    // check if the user already exist
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM admins WHERE user = ?;",
        username,
        (err,result) => {
            if(err){
                res.send({err: err});
            }
            if(result){ 
               if(result.length===0){
                reject(false);
               }
               else resolve(true);
            }
        })
      });
}



app.post("/registeradmin", async (req,res) => {
    const username = req.body.adminusername;
    const password = req.body.adminpassword;
    try {
        var val = await validateadmin(username);
      } catch (err) {
        console.log(err);
      }
      if(val){
        res.send({message: "User with given username already exist!"});
      }
      else{
        bcrypt.hash(password, saltRounds, (err,hash) => {
            if(err){
                console.log(err)
            }
        db.query("INSERT INTO admins (user,password,role) VALUES (?,?,?)",
        [username,hash,1], 
        (err,result) => {
            if (err) {
                //If error
                res.send({err: err});
                console.log(err);
            } 
            else{
                //If success
            res.send({message: "Admin Registration completed successsfully!"});
            //  console.log(result);
            }
        })
      })
    }
})


app.post("/deleteStudent", async (req,res) => {
    const EMPLID = req.body.EMPLID;
    db.query("DELETE FROM users WHERE EmplID = ?",
        [EMPLID], 
        (err,result) => {
            if (err) {
                //If error
                res.send({err: err});
                console.log(err);
            } 
            else{
                //If success
            res.send({message: "Student was deleted successfully!"});
            //  console.log(result);
            }
        })
})

app.post("/deleteAdmin", async (req,res) => {
    const USER = req.body.Adminuser;
    db.query("DELETE FROM admins WHERE user = ?",
        [USER], 
        (err,result) => {
            if (err) {
                //If error
                res.send({err: err});
                console.log(err);
            } 
            else{
                //If success
            res.send({message: "Admin was deleted successfully!"});
            //  console.log(result);
            }
        })
})

app.post("/RFIDRegister", (req,res) => {
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['hello.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// app.listen(process.env.PORT || 3001, ()=> {
//     console.log("running on port 3001");
// })