import { all, takeLatest, put, call } from 'redux-saga/effects';
import { fetchSignUpAsync, fetchUpdateProfileAsync, openPopUp } from 'store/reducers/auth.reducer';
import AuthRepo from './auth.repo';

function* signUp() {
  try {
    
  } catch (error) {
    
  }
}

function* updateProfile(action: ReturnType<typeof fetchUpdateProfileAsync.request>) {
  try {
    const { status } = yield call(AuthRepo.updateProfile, action.payload);

    if (status === 200) {
      yield put(fetchUpdateProfileAsync.success());
      yield put(openPopUp({
        title: '회원가입에 성공하였습니다',
        text: '',
        statue: 'success',
      }));
    }
  } catch (error) {
    yield put(fetchUpdateProfileAsync.failure(error));
    yield put(openPopUp({
      title: '회원가입에 실패하였습니다',
      text: '다시 시도 해주세요',
      statue: 'failure',
    }));
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(fetchSignUpAsync.request, signUp),
    takeLatest(fetchUpdateProfileAsync.request, updateProfile),
  ]);
}