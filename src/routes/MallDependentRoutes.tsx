import React from 'react';

import loadable from 'react-loadable';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { LoadingComponent } from 'src/components/LoadingComponent/LoadingComponent';
import RegistrationForm from 'src/components/RegistrationForm/RegistrationForm';
import { user } from 'src/constants/permissions';
import Exception404 from 'src/pages/Exception/404';
import { RedirectToMallHOC } from './RedirectToMall';

const AsyncZoneRoutes = loadable({
  loader: () => import('./ZoneRoutes'),
  loading: LoadingComponent,
});

const AsyncPoiRoutes = loadable({
  loader: () => import('./PoiRoutes'),
  loading: LoadingComponent,
});

const AsyncPoiMallZoneRoutes = loadable({
  loader: () => import('./PoiMallZoneRoutes'),
  loading: LoadingComponent,
});

const AsyncCategoryRoutes = loadable({
  loader: () => import('./CategoryRoutes'),
  loading: LoadingComponent,
});

const AsyncFeaturedSpaceRoutes = loadable({
  loader: () => import('./FeaturedSpaceRoutes'),
  loading: LoadingComponent,
});

const AsyncDealRoutes = loadable({
  loader: () => import('./DealRoutes'),
  loading: LoadingComponent,
});

const AsyncMapPocPages = loadable({
  loader: () => import('src/pages/MapPocPage/MapPocPage'),
  loading: LoadingComponent,
});

const AsyncEventDirectoryRoutes = loadable({
  loader: () => import('./EventDirectoryRoutes'),
  loading: LoadingComponent,
});

const HomeMall = loadable({
  loader: () => import('src/pages/MallHome/MallHome'),
  loading: LoadingComponent,
});

export const MallDependentRoutes: React.SFC<
  RouteComponentProps<{ id: string }>
> = ({ match }) => {
  return (
    <>
      <Switch>
        <Route
          path={`${match.url}/users/create`}
          component={HasPermission([user.create], RegistrationForm)}
        />
        <Route path={`${match.url}/zones`} component={AsyncZoneRoutes} />
        <Route path={`${match.url}/pois`} component={AsyncPoiRoutes} />
        <Route
          path={`${match.url}/poiMallZone`}
          component={AsyncPoiMallZoneRoutes}
        />
        <Route
          path={`${match.url}/featured-space`}
          component={AsyncFeaturedSpaceRoutes}
        />
        <Route
          path={`${match.url}/categories`}
          component={AsyncCategoryRoutes}
        />
        <Route path={`${match.url}/deals`} component={AsyncDealRoutes} />
        <Route
          path={`${match.url}/events`}
          component={AsyncEventDirectoryRoutes}
        />
        <Route path={`${match.url}/map-poc`} component={AsyncMapPocPages} />
        <Route path={match.url} component={HomeMall} />
        <Route component={Exception404} />
      </Switch>
    </>
  );
};

const componentWithRouter = withRouter(MallDependentRoutes);
export default RedirectToMallHOC(componentWithRouter, {});
