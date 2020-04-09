import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import Pages from './pages';
import rootReducer from './store/reducers';
import rootSaga from './store/sagas';
import sagaMiddleware from './store/sagas/middleware';

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Pages />
      </Router>
    </Provider>
  );
}

export default App;
