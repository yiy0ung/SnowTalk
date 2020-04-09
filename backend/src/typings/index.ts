import { Request } from 'express';
import { Socket } from 'socket.io';

export interface AuthRequest extends Request {
  decoded?: any;
}

export interface AuthSocket extends Socket {
  decoded?: any;
}
