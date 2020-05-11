import { combineReducers } from 'redux';

import core from './core.reducer';
import member from './member.reducer';
import chatSocket from './chatSocket.reducer';

const rootReducer = combineReducers({
  core,
  member,
  chatSocket,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
