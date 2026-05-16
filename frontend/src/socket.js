import { io } from "socket.io-client";
export const socket = io("http://localhost:6142");

//use to give a single pipeline or a same connection for every dynamic update 