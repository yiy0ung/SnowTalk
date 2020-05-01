import React from 'react';
import { Switch, Route } from 'react-router-dom';

import link from 'config/link';

import Home from './Home';
import Friend from './Friend';
import More from './More';
import Sign from './Sign';
import ChatRoom from './ChatRoom';

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
      <Route exact
        path={`${link.chatroom}/:roomIdx`}
        component={ChatRoom} />
    </Switch>
  );
}

export default Pages;
