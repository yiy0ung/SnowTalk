import { all, call } from 'redux-saga/effects';

import coreSaga from './core/core.saga';
import memberSaga from './member/member.saga';
import chatSocketSaga from './chatSocket/chatSocket.saga';

export default function* rootSaga() {
  yield all([
    call(coreSaga),
    call(memberSaga),
    call(chatSocketSaga),
  ]);
}
