import React from 'react';
import { Switch, Route } from 'react-router-dom';

import link from '../config/link';

import Home from './Home';
import Friend from './Friend';
import More from './More';

function Pages() {
  return (
    <Switch>
      <Route exact path={link.home} render={() => <Home />} />
      <Route exact path={link.friend} render={() => <Friend />} />
      <Route exact path={link.more} render={() => <More />} />
    </Switch>
  );
}

export default Pages;