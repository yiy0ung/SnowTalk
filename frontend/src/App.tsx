import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Pages from './pages';
import generateStore from './store';

const { store, persistor } = generateStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Pages />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
