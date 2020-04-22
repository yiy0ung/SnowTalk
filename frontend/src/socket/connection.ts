import socketio from 'socket.io-client';
import server from 'config/server';

const basicPath = '/socket';

export const chatSocket = socketio.connect(`${server.socketHost}/chat`, {
  path: basicPath,
  query: {
    token: sessionStorage.getItem('token'),
  },
});

// chatSocket.on('reconnect', () => {

// })

// export function connectChatSocket() {
//   let socket = null;
//   const token = sessionStorage.getItem('token');
  
//   if (token) {
//     socket = socketio.connect(`${server}/chat`, {
//       path: basicPath,
//       query: {
//         token: sessionStorage.getItem('token'),
//       },
//     });
//   }

//   return socket;
// }
