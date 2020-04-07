import { Service } from "typedi";
import { Server, Namespace, Socket } from 'socket.io';

export function runSocket(io: Server) {

  io.on('connection', (socket: Socket) => {
    console.log("object");
    console.log(socket);
  })
}
