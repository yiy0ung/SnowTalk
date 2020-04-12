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
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_REQUEST = 'LOGIN_REQUEST'; // login
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const MEMBERSINFO_REQUEST = 'MEMBERSINFO_REQUEST'; // my info
export const MEMBERSINFO_SUCCESS = 'MEMBERSINFO_SUCCESS';
export const MEMBERSINFO_FAILURE = 'MEMBERSINFO_FAILURE';
export const APPEND_FRIEND_REQUEST = 'APPEND_FRIEND_REQUEST'; // add member
export const APPEND_FRIEND_SUCCESS = 'APPEND_FRIEND_SUCCESS';
export const APPEND_FRIEND_FAILURE = 'APPEND_FRIEND_FAILURE';
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST'; // remove member
export const REMOVE_FRIEND_SUCCESS = 'REMOVE_FRIEND_SUCCESS';
export const REMOVE_FRIEND_FAILURE = 'REMOVE_FRIEND_FAILURE';


// action func
export const login = createAction(LOGIN)<boolean>();
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
export const fetchAppendFriendAsync = createAsyncAction(
  APPEND_FRIEND_REQUEST,
  APPEND_FRIEND_SUCCESS,
  APPEND_FRIEND_FAILURE,
)<number, undefined, Error>();
export const fetchRemoveFriendAsync = createAsyncAction(
  REMOVE_FRIEND_REQUEST,
  REMOVE_FRIEND_SUCCESS,
  REMOVE_FRIEND_FAILURE,
)<number, undefined, Error>();

const actions = {
  fetchLoginAsync,
  fetchMembersInfoAsync,
  fetchAppendFriendAsync,
  fetchRemoveFriendAsync,
  logout,
  login,
};
type MemberAction = ActionType<typeof actions> 

// reducer
export default createReducer<MemberState, MemberAction>(initialState, {
  [MEMBERSINFO_SUCCESS]: (state, action) => ({
    ...state,
    member: action.payload.member,
    friends: action.payload.friends,
  }),
  [LOGIN]: (state, action) => ({
    ...state,
    isLogin: action.payload,
  }),
  [LOGOUT]: (state) => ({
    ...state,
    isLogin: false,
  }),
});
