import * as ioClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, fork, take, takeEvery, call, put, cancel } from 'redux-saga/effects';
import { PayloadAction } from 'typesafe-actions';

import server from 'config/server';
import { existToken } from 'utils/token';
import { subscribeChatSocket, unsubscribeChatSocket, emitGetRooms, receiveGetRooms } from 'store/reducers/chatSocket.reducer';
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

function generateEmit(socket: SocketIOClient.Socket, actionType: ChatEvent) {
  return function () {
    socket.emit(actionType);
  }
}

function generatePayloadEmit<Action extends PayloadAction<any, any>>(socket: SocketIOClient.Socket, actionType: ChatEvent) {
  return function (action: Action) {
    socket.emit(actionType, action.payload);
  }
}

function* flow() {
  yield takeEvery(subscribeChatSocket, function* () {
    const { socket, error } = yield call(connect);

    if (socket) {
      console.log('connect to chat socket');
      const ioTask = yield fork(handleIO, socket);

      yield take(unsubscribeChatSocket);
      yield cancel(ioTask);
      socket.disconnect();
    } else {
      console.log(`error connecting ${error}`);
    }
  });
}

function* handleIO(socket: SocketIOClient.Socket) {
  yield fork(read, socket); // 이벤트 listener 설정
  yield fork(setEmitActionListener, socket); // 이벤트 emitter 설정
  yield fork(initalEmit); // 최초 연결시, 필요한 emit 전송
}

function* read(socket: SocketIOClient.Socket) {
  const channel = yield call(subscribe, socket);

  yield takeEvery(channel, function* (action) {
    yield put(action);
  });
}

function subscribe(socket: SocketIOClient.Socket) {
  return eventChannel((emit) => {
    socket.on('get-rooms', (resp: ChatSocketResp<GetRoomData>) => {
      if (resp.status === 200 && resp.data) {
        console.log(resp);
        emit(receiveGetRooms(resp.data));
      }
    });

    socket.on('disconnect', (e: any) => {
      console.log(e)
    });
    socket.on('error', (error: Error) => {
      console.log(`Error while trying to connect: ${error}`);
    });

    return () => { };
  });
}

function* setEmitActionListener(socket: SocketIOClient.Socket) {
  yield all([
    takeEvery(emitGetRooms, generateEmit(socket, ChatEvent.getRooms)),
  ])
}

function* initalEmit() {
  yield all([
    put(emitGetRooms()),
  ])
}

export default function* () {
  yield all([
    fork(flow),
  ]);
}
