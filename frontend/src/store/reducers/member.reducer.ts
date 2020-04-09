import {
  createAction,
  createAsyncAction,
  ActionType,
  createReducer,
} from 'typesafe-actions';
import { Member } from 'utils/types/entity.type';
import { LoginReq, LoginRes, MembersInfoRes } from 'utils/types/form.type';

// init state
type MemberState = {
  isLogin: boolean;
  member: Member;
  friends: Member[];
}

export const initialState: MemberState = {
  isLogin: false,
  member: {} as Member,
  friends: [],
};

// action
export const DONELOGIN = 'DONELOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_REQUEST = 'LOGIN_REQUEST'; // login
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const MEMBERSINFO_REQUEST = 'MEMBERSINFO_REQUEST'; // my info
export const MEMBERSINFO_SUCCESS = 'MEMBERSINFO_SUCCESS';
export const MEMBERSINFO_FAILURE = 'MEMBERSINFO_FAILURE';


// action func
export const doneLogin = createAction(DONELOGIN)<boolean>();
export const logout = createAction(LOGOUT)();
export const fetchLoginAsync = createAsyncAction(
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
)<LoginReq, LoginRes, Error>();
export const fetchMembersInfoAsync = createAsyncAction(
  MEMBERSINFO_REQUEST,
  MEMBERSINFO_SUCCESS,
  MEMBERSINFO_FAILURE,
)<undefined, MembersInfoRes, Error>();

const actions = {
  fetchLoginAsync,
  fetchMembersInfoAsync,
  logout,
  doneLogin,
};
type MemberAction = ActionType<typeof actions> 

// reducer
export default createReducer<MemberState, MemberAction>(initialState, {
  [MEMBERSINFO_SUCCESS]: (state, action) => ({
    ...state,
    member: action.payload.member,
    friends: action.payload.friends,
  }),
  [DONELOGIN]: (state, action) => ({
    ...state,
    isLogin: action.payload,
  }),
});
