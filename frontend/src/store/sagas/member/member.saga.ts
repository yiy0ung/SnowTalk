import { all, takeLatest, call, put } from 'redux-saga/effects';
import { map } from 'lodash';
import { fetchLoginAsync, fetchMembersInfoAsync, doneLogin } from 'store/reducers/member.reducer';
import memberRepo from './member.repo';

function* login(action: ReturnType<typeof fetchLoginAsync.request>) {
  try {
    const { id, pw } = action.payload;
    const res = yield call(memberRepo.login, id, pw);
    const { token, refresh } = res.data;

    sessionStorage.setItem('token', token);
    localStorage.setItem('refresh', refresh);

    yield put(fetchLoginAsync.success(res.data));

    yield put(fetchMembersInfoAsync.request());
  } catch (error) {
    yield put(fetchLoginAsync.failure(error));
  }
}

function* getMyInfo() {
  try {
    const myInfo = yield call(memberRepo.getMyInfo);
    const friendData = yield call(memberRepo.getFriends);

    const friends = map(friendData.friend, 'followingMember');

    const result = {
      member: myInfo.info,
      friends,
    };
    
    yield put(fetchMembersInfoAsync.success(result));
    yield put(doneLogin(true));
  } catch (error) {
    yield put(fetchMembersInfoAsync.failure(error));
  }
}

export default function* memberSaga() {
  yield all([
    takeLatest(fetchLoginAsync.request, login),
    takeLatest(fetchMembersInfoAsync.request, getMyInfo),
  ]);
}
