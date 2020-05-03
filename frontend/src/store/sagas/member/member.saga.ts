import { all, takeLatest, call, put } from 'redux-saga/effects';
import { map } from 'lodash';

import memberRepo from './member.repo';
import {
  fetchLoginAsync,
  fetchMembersInfoAsync,
  login as loginAction,
  fetchAppendFriendAsync,
  fetchRemoveFriendAsync,
} from 'store/reducers/member.reducer';
import { subscribeChatSocket } from 'store/reducers/chatSocket.reducer';
import Swal from 'sweetalert2';

function* login(action: ReturnType<typeof fetchLoginAsync.request>) {
  try {
    const { id, pw } = action.payload;
    const res = yield call(memberRepo.login, id, pw);
    const { token, refresh } = res.data;

    sessionStorage.setItem('token', token);
    localStorage.setItem('refresh', refresh);

    yield put(fetchLoginAsync.success(res.data));

    yield all([
      put(fetchMembersInfoAsync.request()),
      put(subscribeChatSocket()),
    ]);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '로그인 실패',
      text: '아이디 또는 비밀번호를 확인해주세요',
    });
    yield put(fetchLoginAsync.failure(error));
  }
}

function* getMyInfo() {
  try {
    const { data: myInfoRes} = yield call(memberRepo.getMyInfo);
    const friendRes = yield call(memberRepo.getFriends);

    const friends = map(friendRes.data.friend, 'followingMember');

    const result = {
      member: myInfoRes.info,
      friends,
    };
    
    yield put(fetchMembersInfoAsync.success(result));
    yield put(loginAction(true));
  } catch (error) {
    yield put(fetchMembersInfoAsync.failure(error));
  }
}

function* appendFriend(action: ReturnType<typeof fetchAppendFriendAsync.request>) {
  try {
    const result = yield call(memberRepo.appendFriends, action.payload);

    if (result.status === 200) {
      yield all([
        put(fetchAppendFriendAsync.success()),
        put(fetchMembersInfoAsync.request()),
      ]);
    }
  } catch (error) {
    yield put(fetchAppendFriendAsync.failure(error));
  }
}

function* removeFriend(action: ReturnType<typeof fetchRemoveFriendAsync.request>) {
  try {
    const result = yield call(memberRepo.removeFriends, action.payload);

    if (result.status === 200) {
      yield all([
        put(fetchRemoveFriendAsync.success()),
        put(fetchMembersInfoAsync.request()),
      ]);
    }
  } catch (error) {
    yield put(fetchRemoveFriendAsync.failure(error));
  }
}

export default function* memberSaga() {
  yield all([
    takeLatest(fetchLoginAsync.request, login),
    takeLatest(fetchMembersInfoAsync.request, getMyInfo),
    takeLatest(fetchAppendFriendAsync.request, appendFriend),
    takeLatest(fetchRemoveFriendAsync.request, removeFriend),
  ]);
}
