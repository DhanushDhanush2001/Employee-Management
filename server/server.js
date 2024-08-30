const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookiesParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./Models/EmployeeModel');
dotenv.config({path:path.join(__dirname,"config/config.env")});
const connectDatabase = require('./Config/databaseConnection');

connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is listening in Port: ${process.env.PORT}`)
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({origin: "http://localhost:3000"}));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )


const auth = require('./routes/auth')
const employe = require('./routes/employe')

app.use('/api/v1',auth);
app.use('/api/v1',employe);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}
module.exports = server