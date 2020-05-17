import { all, takeLatest, put, call } from 'redux-saga/effects';
import { map } from 'lodash';
import AuthRepo from './member.repo';
import UploadRepo from '../upload/upload.repo';
import { SavedImg } from 'utils/types/entity.type';
import memberRepo from './member.repo';
import { openPopUp } from 'store/reducers/core.reducer';
import { 
  fetchSignUpAsync, 
  fetchUpdateProfileAsync, 
  fetchAppendFriendAsync, 
  fetchRemoveFriendAsync,
  fetchUserInfoAsync,
  fetchFriendsListAsync,
} from 'store/reducers/member.reducer';

function* uploadImg(files: File[]) {
  try {
    const { data } = yield call(UploadRepo.uploadImg, files);

    return data.images;
  } catch (error) {
    throw error;
  }
}

function* signUp(action: ReturnType<typeof fetchSignUpAsync.request>) {
  try {
    let profileImgIdx = null;

    if (action.payload.file && typeof action.payload.file === 'object') {
      const files = [action.payload.file];
      const savedFiles: SavedImg[] = yield uploadImg(files);

      profileImgIdx = savedFiles[0].fileIdx;
    }

    const { status } = yield call(AuthRepo.signUp, action.payload, profileImgIdx);

    if (status === 200) {
      yield put(fetchSignUpAsync.success());
      yield put(openPopUp({
        title: '회원가입에 성공하였습니다',
        message: '',
        level: 'success',
      }));
    }
  } catch (error) {
    yield put(fetchUpdateProfileAsync.failure(error));
    yield put(openPopUp({
      title: '회원가입에 실패하였습니다',
      message: '다시 시도 해주세요',
      level: 'warning',
    }));
  }
}

function* updateProfile(action: ReturnType<typeof fetchUpdateProfileAsync.request>) {
  try {
    let profileImgIdx = null;
    if (action.payload.file && typeof action.payload.file === 'object') {
      const files = [action.payload.file];

      const savedFiles: SavedImg[] = yield uploadImg(files);

      profileImgIdx = savedFiles[0].fileIdx;
    } else if (typeof action.payload.file === 'number') {
      profileImgIdx = action.payload.file;
    }

    const { status } = yield call(AuthRepo.updateProfile, action.payload, profileImgIdx);

    if (status === 200) {
      yield all([
        put(fetchUpdateProfileAsync.success()),
        put(fetchUserInfoAsync.request()),
        put(openPopUp({
          title: '정보 수정을 성공하였습니다',
          message: '',
          level: 'success',
        })),
      ]);
    }
  } catch (error) {
    yield put(fetchUpdateProfileAsync.failure(error));
    yield put(openPopUp({
      title: '정보 수정을 실패하였습니다',
      message: '다시 시도 해주세요',
      level: 'warning',
    }));
  }
}

function* appendFriend(action: ReturnType<typeof fetchAppendFriendAsync.request>) {
  try {
    const result = yield call(memberRepo.appendFriends, action.payload);

    if (result.status === 200) {
      yield all([
        put(fetchAppendFriendAsync.success()),
        put(fetchFriendsListAsync.request()),
      ]);
    }
  } catch (error) {
    yield put(fetchAppendFriendAsync.failure(error));
  }
}

function* removeFriend(action: ReturnType<typeof fetchRemoveFriendAsync.request>) {
  try {
    const { status } = yield call(memberRepo.removeFriends, action.payload);

    if (status === 200) {
      yield all([
        put(fetchRemoveFriendAsync.success()),
        put(fetchFriendsListAsync.request()),
      ]);
    }
  } catch (error) {
    yield put(fetchRemoveFriendAsync.failure(error));
  }
}

function* getUserInfo() {
  try {
    const { status, data } = yield call(memberRepo.getUserInfo);

    if (status === 200) {
      yield put(fetchUserInfoAsync.success(data.info));
    }
  } catch (error) {
    yield put(fetchUserInfoAsync.failure(error));
  }
}

function* getFriendsList() {
  try {
    const { status, data } = yield call(memberRepo.getFriends);
    const friends = map(data.friend, 'followingMember');

    if (status === 200) {
      yield put(fetchFriendsListAsync.success(friends));
    }
  } catch (error) {
    yield put(fetchFriendsListAsync.failure(error));
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(fetchSignUpAsync.request, signUp),
    takeLatest(fetchUpdateProfileAsync.request, updateProfile),
    takeLatest(fetchAppendFriendAsync.request, appendFriend),
    takeLatest(fetchRemoveFriendAsync.request, removeFriend),
    takeLatest(fetchUserInfoAsync.request, getUserInfo),
    takeLatest(fetchFriendsListAsync.request, getFriendsList),
  ]);
}