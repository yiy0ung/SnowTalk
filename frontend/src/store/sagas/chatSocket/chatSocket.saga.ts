import { PayloadAction } from 'typesafe-actions';
import { eventChannel } from 'redux-saga';
import { all, fork, take, takeEvery, call, put, cancel, takeLatest } from 'redux-saga/effects';
import * as ioClient from 'socket.io-client';

import link from 'config/link';
import server from 'config/server';
import { existToken } from 'utils/token';
import { pushUrl } from 'store/reducers/core.reducer';
import {
  subscribeChatSocket,
  unsubscribeChatSocket,
  emitGetRooms,
  receiveGetRooms,
  sendMessage,
  receiveMessage,
  receiveCreateRoom,
  emitCreateRoom,
  emitLeaveRoom,
  receiveLeaveRoom,
  receiveLeaveRoomMember,
  emitInviteRoom,
  receiveInviteRoom,
  fetchMessageRecord,
  sendFileMessage,
  receiveInvitedRoom,
} from 'store/reducers/chatSocket.reducer';
import {
  ChatEvent,
  ChatSocketResp,
  GetRoomData,
  ReceiveMsgData,
  CreateRoomData,
  LeaveRoomData,
  InviteRoomData,
} from './chat.event';
import chatRepo from './chat.repo';
import { uploadImg } from '../member/member.saga';
import { SavedImg } from 'utils/types/entity.type';

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

function* socketFlow() {
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
      console.log('방 조회', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveGetRooms(resp.data));
      }
    });
    socket.on(ChatEvent.receiveMsg, (resp: ChatSocketResp<ReceiveMsgData>) => {
      console.log('메시지 받음', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveMessage(resp.data));
      }
    });
    socket.on(ChatEvent.createRoom, (resp: ChatSocketResp<CreateRoomData>) => {
      console.log('방 생성 ', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveCreateRoom(resp.data));
        emit(pushUrl(`${link.chatroom}/${resp.data.room.idx}`));
      }
    });
    socket.on(ChatEvent.createdRoom, (resp: ChatSocketResp<CreateRoomData>) => {
      console.log('방 생성 당함 ', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveCreateRoom(resp.data));
      }
    });
    socket.on(ChatEvent.inviteRoom, (resp: ChatSocketResp<InviteRoomData>) => {
      console.log('방에 회원 초대', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveInviteRoom(resp.data));
      }
    });
    socket.on(ChatEvent.invitedRoom, (resp: ChatSocketResp<InviteRoomData>) => {
      console.log('방에 초대 됨', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveInvitedRoom(resp.data));
      }
    });
    socket.on(ChatEvent.leaveRoom, (resp: ChatSocketResp<LeaveRoomData>) => {
      console.log('방을 떠남 ',resp);
      if (resp.status === 200 && resp.data) {
        emit(pushUrl(link.home));
        emit(receiveLeaveRoom(resp.data));
      }
    });
    socket.on(ChatEvent.leaveRoomMember, (resp: ChatSocketResp<LeaveRoomData>) => {
      console.log('방에서 누가 떠남', resp);
      if (resp.status === 200 && resp.data) {
        emit(receiveLeaveRoomMember(resp.data));
      }
    });

    socket.on('disconnect', (e: any) => {
      console.log(e);
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
    takeEvery(emitLeaveRoom, payloadEmitter(socket, ChatEvent.leaveRoom)),
    takeEvery(emitInviteRoom, payloadEmitter(socket, ChatEvent.inviteRoom)),
  ]);
}

function* initalEmit() {
  yield all([
    put(emitGetRooms()),
  ]);
}

// ***************************************

function *requestMessageRecord(action: ReturnType<typeof fetchMessageRecord.request>) {
  try {
    const { roomIdx, lastMessageIdx } = action.payload;
    const resp = yield call(chatRepo.getMessageRecord, roomIdx, lastMessageIdx);

    if (resp.status === 200) {
      yield put(fetchMessageRecord.success({
        roomIdx: resp.data.roomIdx,
        messages: resp.data.messages,
      }));
    } else {
      throw new Error('메시지를 조회할 수 없습니다');
    }
  } catch (error) {
    yield put(fetchMessageRecord.failure(error));
  }
}

function *requestFileMessage(action: ReturnType<typeof sendFileMessage>) {
  try {
    const { roomIdx, message, file } = action.payload;
    const savedFiles: SavedImg[] = yield uploadImg([file]);
    
    const profileImgIdx = savedFiles[0].fileIdx;

    yield put(sendMessage({
      roomIdx,
      message,
      imageIdx: profileImgIdx,
    }));
  } catch (error) {
    console.error('file message error : ', error);
  }
}

export default function* () {
  yield all([
    fork(socketFlow),
    takeLatest(fetchMessageRecord.request, requestMessageRecord),
    takeLatest(sendFileMessage, requestFileMessage),
  ]);
}
