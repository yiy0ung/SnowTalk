import * as ioClient from 'socket.io-client';
import { all, fork, takeLatest, call } from 'redux-saga/effects';
import server from 'config/server';
import { existToken } from 'utils/token';
import { subscribeChatSocket } from 'store/reducers/chatSocket.reducer';

function connect() {
  const socket = ioClient.connect(`${server.socketHost}/chat`, {
    path: '/socket',
    query: {
      token: existToken(),
    },
    // autoConnect: false,
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      resolve({ socket });
    });

    socket.on('connect_error', () => {
      reject(new Error('ws:connect_failed'));
    });
  }).catch(error => ({ socket, error }));
}

function flow() {
  takeLatest(subscribeChatSocket, function* () {
    const { socket, error } = yield call(connect);
    if (socket) {
      console.log('connect to chat socket');
    } else {
      console.log(`error connecting ${error}`);
    }
  });
}

export default function* () {
  yield all([
    fork(flow),
  ]);
}