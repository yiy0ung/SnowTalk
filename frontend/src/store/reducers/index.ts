import { combineReducers } from 'redux';

import member from './member.reducer';
import auth from './auth.reducer';

const rootReducer = combineReducers({
  member,
  auth,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
