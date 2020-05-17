import { all, takeLatest, call, put } from 'redux-saga/effects';

import memberRepo from './core.repo';

import { fetchLoginAsync, openPopUp } from 'store/reducers/core.reducer';
import { subscribeChatSocket } from 'store/reducers/chatSocket.reducer';
import { fetchUserInfoAsync, fetchFriendsListAsync } from 'store/reducers/member.reducer';

function* login(action: ReturnType<typeof fetchLoginAsync.request>) {
  try {
    const { id, pw } = action.payload;
    const res = yield call(memberRepo.login, id, pw);
    const { token, refresh } = res.data;

    sessionStorage.setItem('token', token);
    localStorage.setItem('refresh', refresh);

    yield put(fetchLoginAsync.success());

    yield all([
      put(fetchUserInfoAsync.request()),
      put(fetchFriendsListAsync.request()),
      put(subscribeChatSocket()),
    ]);
  } catch (error) {
    yield put(fetchLoginAsync.failure(error));
    yield put(openPopUp({
      title: '로그인 실패',
      message: '아이디 또는 비밀번호를 확인해주세요',
      level: 'warning',
    }));
  }
}

export default function* memberSaga() {
  yield all([
    takeLatest(fetchLoginAsync.request, login),
  ]);
}
