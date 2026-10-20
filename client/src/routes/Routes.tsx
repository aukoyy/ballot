import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RouteMap } from './RouteMap';
import { HomeComponent } from './home/Home';
import { EditPollComponent } from './manage/EditPoll';
import { LoginComponent } from './login/Login';
import { RegisterComponent } from './login/Register';
import { LoginGuard } from './login/LoginGuard';
import { ManagePollsComponent } from './manage/ManagePolls';
import { NavbarContainer } from './navbar/NavbarContainer';
import { ConductPollComponent } from './conduct/ConductPoll';
import { ResultsComponent } from './results/Results';
import { VoteComponent } from './vote/Vote';

export const Routes = () => {
  return (
    <BrowserRouter>
      <NavbarContainer>
        <Switch>
          <Route
            path={RouteMap.home.path}
            component={HomeComponent}
            exact={true}
          />
          <Route
            path={RouteMap.user.register}
            component={RegisterComponent}
            exact={true}
          />
          <Route
            path={RouteMap.user.login}
            component={LoginComponent}
            exact={true}
          />
          <Route
            path={RouteMap.vote.path}
            component={VoteComponent}
            exact={true}
          />
          <LoginGuard>
            <Route
              path={RouteMap.manage.path}
              component={ManagePollsComponent}
              exact={true}
            />
            <Route
              path={RouteMap.manage.edit.path}
              component={EditPollComponent}
              exact={true}
            />
            <Route
              path={RouteMap.conduct.path}
              component={ConductPollComponent}
              exact={true}
            />
            <Route
              path={RouteMap.results.path}
              component={ResultsComponent}
              exact={true}
            />
          </LoginGuard>
        </Switch>
      </NavbarContainer>
    </BrowserRouter>
  );
};
