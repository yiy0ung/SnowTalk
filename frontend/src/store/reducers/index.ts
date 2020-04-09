import { combineReducers } from 'redux';

import member from './member.reducer';

const rootReducer = combineReducers({
  member,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
