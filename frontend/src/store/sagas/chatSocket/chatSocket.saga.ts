import * as ioClient from 'socket.io-client';
import { all, fork, take, takeEvery, call, put, cancel } from 'redux-saga/effects';
import server from 'config/server';
import { existToken } from 'utils/token';
import { subscribeChatSocket, unsubscribeChatSocket } from 'store/reducers/chatSocket.reducer';
import { eventChannel } from 'redux-saga';
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

function* flow() {
  yield takeEvery(subscribeChatSocket, function* () {
    const { socket, error } = yield call(connect);

    if (socket) {
      console.log('connect to chat socket');
      const ioTask = yield fork(handleIO, socket);

      yield take(unsubscribeChatSocket);
      socket.disconnect();
      yield cancel(ioTask);
    } else {
      console.log(`error connecting ${error}`);
    }
  });
}

function subscribe(socket: SocketIOClient.Socket) {
  return eventChannel((emitter) => {
    // const emit = (data: any) => emitter(data);
    socket.on(ChatEvent.getRooms, (resp: ChatSocketResp<GetRoomData>) => {
      console.log(resp);
    });

    return () => { };
  });
}

function* read(socket: SocketIOClient.Socket) {
  const channel = yield call(subscribe, socket);
  while(true) {
    const { eventType, data } = yield take(channel);
    console.log(eventType);
    if (data) {
      yield put(eventType(data));
    } else {
      yield put(eventType());
    }
  }
}

function* handleIO(socket: SocketIOClient.Socket) {
  yield fork(read, socket);
}

export default function* () {
  yield all([
    fork(flow),
  ]);
}
