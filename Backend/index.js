require('dotenv').config();
const express=require("express");
const app=express();
const DBconnect=require("./db")
const bodyParser = require("body-parser");
const authRouter=require("./routes/AuthRoutesAPI");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

// DBconnect();   uncomment on tesing time

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("connected be")
})

app.use("/api",authRouter)

app.listen(process.env.PORT,()=>{
    console.log("Server running on "+process.env.PORT); 
})