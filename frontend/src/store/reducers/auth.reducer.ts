import {
  createAction,
  createAsyncAction,
  ActionType,
  createReducer,
} from 'typesafe-actions';
import { InitMember } from 'utils/types/entity.type';

type AuthState = {
  popup: {
    visible: boolean;
    title: string;
    text: string;
  },
};


export const initialState: AuthState = {
  popup: {
    visible: false,
    title: '',
    text: '',
  },
};

export const OPEN_POPUP = 'OPEN_POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

export const openPopUp = createAction(OPEN_POPUP)<{title: string; text: string;}>();
export const closePopUp = createAction(CLOSE_POPUP)();
export const fetchSignUpAsync = createAsyncAction(
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
)<Partial<InitMember>&{file: File|null}, undefined, Error>();
export const fetchUpdateProfileAsync = createAsyncAction(
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
)<Partial<InitMember>, undefined, Error>();

const actions = {
  openPopUp,
  closePopUp,
  fetchSignUpAsync,
  fetchUpdateProfileAsync,
};
type AuthAction = ActionType<typeof actions>;

export default createReducer<AuthState, AuthAction>(initialState, {
  [OPEN_POPUP]: (state, action) => ({
    ...state,
    popup: {
      visible: true,
      title: action.payload.title,
      text: action.payload.text,
    },
  }),
  [CLOSE_POPUP]: (state) => ({
    ...state,
    popup: {
      visible: false,
      title: '',
      text: '',
    },
  }),
});
