import React from 'react';

import loadable from 'react-loadable';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { LoadingComponent } from 'src/components/LoadingComponent/LoadingComponent';
import { BasicLayout } from 'src/layouts/BasicLayout';

const AsyncMallRoutes = loadable({
  loader: () => import('./MallRoutes'),
  loading: LoadingComponent,
});

const AsyncMalldependent = loadable({
  loader: () => import('./MallDependentRoutes'),
  loading: LoadingComponent,
});

const AsyncException403 = loadable({
  loader: () => import('src/pages/Exception/403'),
  loading: LoadingComponent,
});

const AsyncException404 = loadable({
  loader: () => import('src/pages/Exception/404'),
  loading: LoadingComponent,
});

const AsyncException500 = loadable({
  loader: () => import('src/pages/Exception/500'),
  loading: LoadingComponent,
});

const AsyncRedirectToMall = loadable({
  loader: () => import('./RedirectToMall'),
  loading: LoadingComponent,
});

const CMSRoutes: React.SFC<RouteComponentProps> = (props) => {
  const { match } = props;
  return (
    <BasicLayout>
      <Switch>
        <Route path={`${match.url}/mall/:id`} component={AsyncMalldependent} />
        <Route path={`${match.url}/malls`} component={AsyncMallRoutes} />
        <Route path={`${match.url}/403`} component={AsyncException403} />
        <Route path={`${match.url}/404`} component={AsyncException404} />
        <Route path={`${match.url}/500`} component={AsyncException500} />
        <Route component={AsyncRedirectToMall} />
      </Switch>
    </BasicLayout>
  );
};
export default CMSRoutes;
