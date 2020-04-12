import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

import rootReducer from 'store/reducers';
import rootSaga from 'store/sagas';
import sagaMiddleware from 'store/sagas/middleware';

const persistedReducer = persistReducer({
  key: 'snowtalk-root',
  storage,
}, rootReducer);

export default () => {
  const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware),
  );
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
