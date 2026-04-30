require('dotenv').config();
const express=require("express");
const app=express();
const DBconnect=require("./db")
const bodyParser = require("body-parser");
const authRouter=require("./routes/AuthRoutesAPI");
const taskRouter=require("./routes/taskRoutesAPI")
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());

DBconnect(); 

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("connected be")
})

app.use("/api/auth",authRouter)
app.use("/api/tasks",taskRouter)

app.listen(process.env.PORT,()=>{
    console.log("Server running on "+process.env.PORT); 
})