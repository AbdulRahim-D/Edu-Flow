require('dotenv').config();
const express = require("express");
const DBconnect = require("./db")
const cookieParser = require('cookie-parser');
const http = require("http")
const { Server } = require("socket.io")
const bodyParser = require("body-parser");


const authRouter = require("./routes/AuthRoutesAPI");
const taskRouter = require("./routes/taskRoutesAPI")
const classRouter = require("./routes/classRoutesAPI")
const userRouter = require("./routes/userRoutesAPI")

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
})

io.on("connection", (socket) => {
    console.log(`new user ${socket.id} connected to the server`);

    socket.emit("message","welcome to Edu-Flow Real Time Application⚡")

    socket.on("join_class",(classId)=>{
        socket.join(classId);
        console.log(` User ${socket.id} joined room: ${classId}`);
    })

    socket.on("disconnect", () => {
        console.log(`user ${socket.id} disconnected to the server`);
    })
})



app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req,res,next)=>{
    req.io=io;
    next();
})

DBconnect();

app.get("/", (req, res) => {
    res.send("Edu-Flow Backend is On!")
})

app.use("/api/class", classRouter)
app.use("/api/auth", authRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/users", userRouter)

const PORT=process.env.PORT||5000
server.listen(PORT, () => {
    console.log("Server running on " + process.env.PORT);
})