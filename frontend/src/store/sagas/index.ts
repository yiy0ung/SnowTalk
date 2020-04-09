import { all, call } from 'redux-saga/effects';
import memberSaga from './member/member.saga';

export default function* rootSaga() {
  yield all([
    call(memberSaga),
  ]);
}
