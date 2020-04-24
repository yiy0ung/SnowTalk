import { all, call } from 'redux-saga/effects';

import memberSaga from './member/member.saga';
import authSaga from './auth/auth.saga';
import chatSocketSaga from './chatSocket/chatSocket.saga';

export default function* rootSaga() {
  yield all([
    call(memberSaga),
    call(authSaga),
    call(chatSocketSaga),
  ]);
}
