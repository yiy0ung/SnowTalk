import * as ioClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, fork, take, takeEvery, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from 'typesafe-actions';

import server from 'config/server';
import { existToken } from 'utils/token';
import { subscribeChatSocket, unsubscribeChatSocket, emitGetRooms } from 'store/reducers/chatSocket.reducer';
import { ChatEvent, ChatSocketResp, GetRoomData } from './chat.event';

function connect() {
  const socket = ioClient.connect(`${server.socketHost}/chat`, {
    path: '/socket',
    query: {
      token: existToken(),
    },
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

function subscribe(socket: SocketIOClient.Socket) {
  return eventChannel((emit) => {
    socket.on('get-rooms', (resp: any) => {
      console.log("object");
      console.log(resp);
      emit(resp);
    });
    socket.on('disconnect', (e: Error) => {
      console.log(e)
    });
    socket.on('error', (error: Error) => {
      console.log('Error while trying to connect');
    });
    return () => { };
  });
}

function* read(socket: SocketIOClient.Socket) {
  const channel = yield call(subscribe, socket);

  while(true) {
    const action = yield take(channel);
    console.log(action);
    
    // yield put(action);
  }
}

function* flow() {
  yield takeEvery(subscribeChatSocket, function* () {
    const { socket, error } = yield call(connect);

    console.log(socket);
    if (socket) {
      console.log('connect to chat socket');
      const ioTask = yield fork(handleIO, socket);
      console.log(ioTask);
      yield take(unsubscribeChatSocket);
      yield cancel(ioTask);
      socket.disconnect();
    } else {
      console.log(`error connecting ${error}`);
    }
  });
}

function* handleIO(socket: SocketIOClient.Socket) {
  console.log('call handleIO')
  yield fork(read, socket);
  yield fork(setEmitActionListener, socket);
}

function generateEmit(socket: SocketIOClient.Socket, actionType: ChatEvent) {
  return function () {
    socket.emit(actionType);
  }
}

function generatePayloadEmit<Action extends PayloadAction<any, any>>(actionType: ChatEvent) {
  return function* (action: Action) {
    const { socket, error } = yield call(connect);

    if (!socket.connected || error) {
      return;
    }

    socket.emit(actionType, action.payload);
  }
}

function* setEmitActionListener(socket: SocketIOClient.Socket) {
  yield all([
    takeEvery(emitGetRooms, generateEmit(socket, ChatEvent.getRooms)),
  ])
}

export default function* () {
  yield all([
    fork(flow),
  ]);
}
