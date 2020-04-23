import { all, call } from 'redux-saga/effects';

import memberSaga from './member/member.saga';
import authSaga from './auth/auth.saga';
import chatSaga from './chat/chat.saga';

export default function* rootSaga() {
  yield all([
    call(memberSaga),
    call(authSaga),
    call(chatSaga),
  ]);
}
