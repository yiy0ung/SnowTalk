import * as ioClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, fork, take, takeEvery, call, put, cancel } from 'redux-saga/effects';
import { PayloadAction } from 'typesafe-actions';

import server from 'config/server';
import { existToken } from 'utils/token';
import { ChatEvent, ChatSocketResp, GetRoomData, ReceiveMsgData, CreateRoomData } from './chat.event';
import {
  subscribeChatSocket,
  unsubscribeChatSocket,
  emitGetRooms,
  receiveGetRooms,
  sendMessage,
  receiveMessage,
  receiveCreateRoom,
  emitCreateRoom,
} from 'store/reducers/chatSocket.reducer';

function connect() {
  const socket = ioClient.connect(`${server.host}/chat`, {
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

function emitter(socket: SocketIOClient.Socket, actionType: ChatEvent) {
  return function () {
    socket.emit(actionType);
  }
}

function payloadEmitter<Action extends PayloadAction<any, any>>(socket: SocketIOClient.Socket, actionType: ChatEvent) {
  return function (action: Action) {
    if (action.payload) {
      socket.emit(actionType, action.payload);
    }
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
  yield fork(setEmitters, socket); // 이벤트 emitter 설정
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
    socket.on(ChatEvent.getRooms, (resp: ChatSocketResp<GetRoomData>) => {
      if (resp.status === 200 && resp.data) {
        emit(receiveGetRooms(resp.data));
      }
    });
    socket.on(ChatEvent.receiveMsg, (resp: ChatSocketResp<ReceiveMsgData>) => {
      if (resp.status === 200 && resp.data) {
        emit(receiveMessage(resp.data));
      }
    });
    socket.on(ChatEvent.createRoom, (resp: ChatSocketResp<CreateRoomData>) => {
      console.log(resp);
      if (resp.status === 200 && resp.data) {
        // const { room, members } = resp.data;
        // room.participants = members;
        emit(receiveCreateRoom(resp.data));
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

function* setEmitters(socket: SocketIOClient.Socket) {
  yield all([
    takeEvery(sendMessage, payloadEmitter(socket, ChatEvent.sendMsg)),
    takeEvery(emitGetRooms, emitter(socket, ChatEvent.getRooms)),
    takeEvery(emitCreateRoom, payloadEmitter(socket, ChatEvent.createRoom)),
  ]);
}

function* initalEmit() {
  yield all([
    put(emitGetRooms()),
  ]);
}

export default function* () {
  yield all([
    fork(flow),
  ]);
}
