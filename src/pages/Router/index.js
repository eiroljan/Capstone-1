import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Login from 'pages/Login';
import Home from 'pages/Home';
import Users from 'pages/Users';
import Profile from 'pages/Profile';
import ResetPassword from 'pages/ResetPassword';
import NotFound from 'pages/NotFound';
import User from 'pages/User';
import Clients from 'pages/Clients';
import Submenu from 'pages/Submenu';
import Teams from 'pages/Teams';
import paths from './paths';
import PrivateRoute from './PrivateRoute';
// import Client from 'pages/Client';

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={paths.LOGIN} component={Login} />
        <Route exact path={paths.RESET_PASSWORD} component={ResetPassword} />
        <PrivateRoute path={paths.ADD_USER} component={User} />
        <PrivateRoute path={paths.MODIFY_USER} component={User} />
        <PrivateRoute path={paths.USERS} component={Users} />
        <PrivateRoute path={paths.PROFILE} component={Profile} />
        <PrivateRoute path={paths.CLIENTS} component={Clients} />
        <PrivateRoute path={paths.SUBMENU_1} component={Submenu} />
        <PrivateRoute path={paths.SUBMENU_2} component={Submenu} />
        <PrivateRoute path={paths.TEAMS} component={Teams} />
        <PrivateRoute path={paths.ROOT} component={Home} />
        <PrivateRoute path={paths.CLIENTS} component={Clients} />
        {/* <PrivateRoute path={paths.ADD_CLIENT} component={Client} /> */}
        
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default RouterComponent;
