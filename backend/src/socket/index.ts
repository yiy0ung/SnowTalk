import { Container } from "typedi";
import { Server, Namespace } from 'socket.io';
import { ChatNmsp } from "./namespace/chat/chat.nmsp";

export function runSocket(io: Server) {
  io.origins('*:*');

  const chat: Namespace = io.of('/chat');

  ChatNmsp.instance = chat;

  chat.on('connection', Container.get(ChatNmsp).handleingEvent);
}

// socket status
// https://gist.github.com/gabrielfalcao/4216897