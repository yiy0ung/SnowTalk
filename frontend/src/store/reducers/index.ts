import { combineReducers } from 'redux';

import member from './member.reducer';
import auth from './auth.reducer';
import chatSocket from './chatSocket.reducer';

const rootReducer = combineReducers({
  member,
  auth,
  chatSocket,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
