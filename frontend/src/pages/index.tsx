import React from 'react';
import { Switch, Route } from 'react-router-dom';

import link from 'config/link';

import Home from './Home';
import Friend from './Friend';
import More from './More';
import Sign from './Sign';

function Pages() {
  return (
    <Switch>
      <Route exact
        path={link.home}
        component={Home} />
      <Route exact
        path={link.friend}
        component={Friend} />
      <Route exact
        path={link.more}
        component={More} />
      <Route exact
        path={link.sign}
        component={Sign} />
    </Switch>
  );
}

export default Pages;
