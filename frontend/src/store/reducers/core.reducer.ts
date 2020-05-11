import {
  createAction,
  createAsyncAction,
  ActionType,
  createReducer,
} from 'typesafe-actions';
import { LoginReq } from 'utils/types/form.type';

// init state
type CoreState = {
  isLogin: boolean;
  popup: {
    visible: boolean;
    title: string;
    message: string;
  };
}

export const initialState: CoreState = {
  isLogin: false,
  popup: {
    visible: false,
    title: '',
    message: '',
  },
};

// action
export const OPEN_POPUP = 'OPEN_POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';
export const LOGIN_REQUEST = 'LOGIN_REQUEST'; // login
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';


// action func
export const logout = createAction(LOGOUT)();
export const openPopUp = createAction(OPEN_POPUP)<{title: string; message: string;}>();
export const closePopUp = createAction(CLOSE_POPUP)();
export const fetchLoginAsync = createAsyncAction(
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
)<LoginReq, undefined, Error>();

const actions = {
  logout,
  openPopUp,
  closePopUp,
  fetchLoginAsync,
};
type CoreAction = ActionType<typeof actions>;


// reducer
export default createReducer<CoreState, CoreAction>(initialState, {
  [LOGIN_SUCCESS]: (state) => ({
    ...state,
    isLogin: true,
  }),
  [LOGOUT]: (state) => ({
    ...state,
    isLogin: false,
  }),
  [OPEN_POPUP]: (state, action) => ({
    ...state,
    popup: {
      visible: true,
      title: action.payload.title,
      message: action.payload.message,
    },
  }),
  [CLOSE_POPUP]: (state) => ({
    ...state,
    popup: {
      visible: false,
      title: '',
      message: '',
    },
  }),
});
