import { all, call } from 'redux-saga/effects';

import memberSaga from './member/member.saga';
import authSaga from './auth/auth.saga';

export default function* rootSaga() {
  yield all([
    call(memberSaga),
    call(authSaga),
  ]);
}
