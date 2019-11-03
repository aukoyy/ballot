import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RouteMap } from './RouteMap';
import { HomeComponent } from './home/Home';
import { PoleComponent } from './pole/Pole';
import { CreateComponent } from './create/Create';
import { NewPoleComponent } from './create/new-pole/NewPole';
import { LoginComponent } from './login/login';

export const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={RouteMap.home.path}
          component={HomeComponent}
          exact={true}
        />
        <Route
          path={RouteMap.login.path}
          component={LoginComponent}
          exact={true}
        />
        <Route
          path={RouteMap.pole.path}
          component={PoleComponent}
          exact={true}
        />
        <Route
          path={RouteMap.create.path}
          component={CreateComponent}
          exact={true}
        />
        <Route
          path={RouteMap.create.new}
          component={NewPoleComponent}
          exact={true}
        />
        <Route />
      </Switch>
    </BrowserRouter>
  );
};
