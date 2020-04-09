import React, { ReactNode } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import link from '../config/link';
import { existToken } from 'utils/token';

import Home from './Home';
import Friend from './Friend';
import More from './More';
import Sign from './Sign';

function AuthPage({ PageNode, requiredToken = true }: { PageNode: ReactNode, requiredToken?: boolean }) {
  const notAuth = existToken() === null;

  if (requiredToken && notAuth) {
    return (<Redirect to={link.sign} />);
  }

  return (<>{PageNode}</>);
}

function Pages() {
  return (
    <Switch>
      <Route exact
        path={link.home}
        render={() => <AuthPage PageNode={<Home />} />} />
      <Route exact
        path={link.friend}
        render={() => <AuthPage PageNode={<Friend />} />} />
      <Route exact
        path={link.more}
        render={() => <AuthPage PageNode={<More />} />} />
      <Route exact
        path={link.sign}
        render={() => <AuthPage PageNode={<Sign />} requiredToken={false} />}/>
    </Switch>
  );
}

export default Pages;