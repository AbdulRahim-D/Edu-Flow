require('dotenv').config();
const express = require("express");
const DBconnect = require("./db")
const cookieParser = require('cookie-parser');
const http = require("http")
const { Server } = require("socket.io")
const bodyParser = require("body-parser");
const cors=require("cors")


const authRouter = require("./routes/AuthRoutesAPI");
const taskRouter = require("./routes/taskRoutesAPI")
const classRouter = require("./routes/classRoutesAPI")
const userRouter = require("./routes/userRoutesAPI")

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials:true,
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


app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}))

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req,res,next)=>{
    req.io=io;
    next();
})


app.get("/", (req, res) => {
    res.send("Edu-Flow Backend is On!")
})

app.use("/api/class", classRouter)
app.use("/api/auth", authRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/users", userRouter)


const PORT=process.env.PORT||6142
DBconnect();
server.listen(PORT, () => {
    console.log("Server running on " + PORT);
})
