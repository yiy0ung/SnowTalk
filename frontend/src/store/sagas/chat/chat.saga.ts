import { all, takeLatest, put } from "redux-saga/effects";
import { chatSocket } from "socket/connection";
import { PayloadActionCreator } from "typesafe-actions";
import {
  connectChatSocket,
  setChatEventListener,
  receiveMessage,
  receiveGetRooms,
  emitGetRooms,
} from "store/reducers/chat.reducer";
import { 
  ChatEvent, 
  ChatSocketResp, 
  ReceiveMsgData, 
  GetRoomData,
} from "./chat.event";

function* connectSocket() {
  yield chatSocket.open();
  console.log("connect socket saga " + chatSocket.connected);
  yield put(setChatEventListener());
  yield put(emitGetRooms());
}

function setEventListener() {

  if (!chatSocket.connected) {
    return;
  }

  chatSocket.on(ChatEvent.getRooms, function* (res: ChatSocketResp<GetRoomData>) {
    const { status, data } = res;
    console.log(res);
    if (status === 200 && data) {
      yield put(receiveGetRooms(data));
    }
  });

  chatSocket.on(ChatEvent.receiveMsg, function* (res: ChatSocketResp<ReceiveMsgData>) {
    const { status, message, data } = res;

    if (status === 200 && data) {
      yield put(receiveMessage(data));
    } else {
      console.log(`메시지 수신 실패 : ${message}`);
    }
  });

  chatSocket.on(ChatEvent.createRoom, function* () {

  });
}

function createEmitter<ActionType extends PayloadActionCreator<any, any>>(event: ChatEvent) {
  return function(action: ReturnType<ActionType>) {
    const { payload } = action;
    console.log(action);
    if (!chatSocket.connected) {
      return;
    }

    if (payload) {
      chatSocket.emit(event, payload);
    } else {
      chatSocket.emit(event);
    }
  }
}

export default function* () {
  yield all([
    takeLatest(connectChatSocket, connectSocket),
    takeLatest(setChatEventListener, setEventListener),
    takeLatest(emitGetRooms, createEmitter(ChatEvent.getRooms)),
  ]);
}
