import socketio from 'socket.io-client';
import server from 'config/server';
import { existToken } from 'utils/token';

const basicPath = '/socket';

export const chatSocket = socketio.connect(`${server.socketHost}/chat`, {
  path: basicPath,
  query: {
    token: existToken(),
  },
  autoConnect: false,
});
