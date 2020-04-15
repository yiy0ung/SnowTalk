import { all, takeLatest, put, call } from 'redux-saga/effects';
import { fetchSignUpAsync, fetchUpdateProfileAsync, openPopUp } from 'store/reducers/auth.reducer';
import AuthRepo from './auth.repo';
import UploadRepo from '../upload/upload.repo';
import { SavedImg } from 'utils/types/entity.type';
import { fetchMembersInfoAsync } from 'store/reducers/member.reducer';

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
        text: '',
      }));
    }
  } catch (error) {
    yield put(fetchUpdateProfileAsync.failure(error));
    yield put(openPopUp({
      title: '회원가입에 실패하였습니다',
      text: '다시 시도 해주세요',
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
        yield put(fetchUpdateProfileAsync.success()),
        yield put(openPopUp({
          title: '정보 수정을 성공하였습니다',
          text: '',
        })),
      ]);

      yield put(fetchMembersInfoAsync.request());
    }
  } catch (error) {
    yield put(fetchUpdateProfileAsync.failure(error));
    yield put(openPopUp({
      title: '정보 수정을 실패하였습니다',
      text: '다시 시도 해주세요',
    }));
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(fetchSignUpAsync.request, signUp),
    takeLatest(fetchUpdateProfileAsync.request, updateProfile),
  ]);
}