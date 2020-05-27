import React, { lazy, Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { GuestGuard } from './components/GuestGuard';
import { LoadingScreen } from './components/Loading';
import { Layout } from './components/Layout';

const routesConfig = [
  {
    exact: true,
    key: 'root',
    path: '/',
    guard: AuthGuard,
    layout: true,
    component: lazy(() => import('./views/Orders')),
  },
  {
    exact: true,
    key: 'login',
    path: '/login',
    guard: GuestGuard,
    layout: false,
    component: lazy(() => import('./views/Login')),
  },
];

export const Routes: React.FC = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routesConfig.map(route => {
        const Guard = route.guard || Fragment;
        const Component = route.component;
        const Wrapper = route.layout ? Layout : Fragment;

        return (
          <Route
            key={route.key}
            path={route.path}
            exact={route.exact}
            render={() => (
              <Wrapper>
                <Guard>
                  <Component />
                </Guard>
              </Wrapper>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);
