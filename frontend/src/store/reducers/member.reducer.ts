import {
  createAsyncAction,
  ActionType,
  createReducer,
} from 'typesafe-actions';
import { InitMember, Member } from 'utils/types/entity.type';

type MemberState = {
  user: Member;
  friends: Member[];
};


export const initialState: MemberState = {
  user: {} as Member,
  friends: [],
};

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const USER_INFO_REQUEST = 'USER_INFO_REQUEST';
export const USER_INFO_SUCCESS = 'USER_INFO_SUCCESS';
export const USER_INFO_FAILUSE = 'USER_INFO_FAILUSE';
export const FRIENDS_LIST_REQUEST = 'FRIENDS_LIST_REQUEST';
export const FRIENDS_LIST_SUCCESS = 'FRIENDS_LIST_SUCCESS';
export const FRIENDS_LIST_FAILURE = 'FRIENDS_LIST_FAILURE';
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
export const APPEND_FRIEND_REQUEST = 'APPEND_FRIEND_REQUEST'; // add member
export const APPEND_FRIEND_SUCCESS = 'APPEND_FRIEND_SUCCESS';
export const APPEND_FRIEND_FAILURE = 'APPEND_FRIEND_FAILURE';
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST'; // remove member
export const REMOVE_FRIEND_SUCCESS = 'REMOVE_FRIEND_SUCCESS';
export const REMOVE_FRIEND_FAILURE = 'REMOVE_FRIEND_FAILURE';

export const fetchSignUpAsync = createAsyncAction(
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
)<Partial<InitMember>&{file: File|number|null}, undefined, Error>();
export const fetchUpdateProfileAsync = createAsyncAction(
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
)<Partial<InitMember>&{file: File|number|null}, undefined, Error>();
export const fetchUserInfoAsync = createAsyncAction(
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
  USER_INFO_FAILUSE,
)<undefined, Member, Error>();
export const fetchFriendsListAsync = createAsyncAction(
  FRIENDS_LIST_REQUEST,
  FRIENDS_LIST_SUCCESS,
  FRIENDS_LIST_FAILURE,
)<undefined, Member[], Error>();
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
  fetchSignUpAsync,
  fetchUpdateProfileAsync,
  fetchUserInfoAsync,
  fetchFriendsListAsync,
  fetchAppendFriendAsync,
  fetchRemoveFriendAsync,
};
type MemberAction = ActionType<typeof actions>;

export default createReducer<MemberState, MemberAction>(initialState, {
  [USER_INFO_SUCCESS]: (state, action) => ({
    ...state,
    user: action.payload,
  }),
  [FRIENDS_LIST_SUCCESS]: (state, action) => ({
    ...state,
    friends: action.payload,
  }),
});
