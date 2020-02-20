import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { poi } from 'src/constants/permissions';
import CreatePoiPage from 'src/pages/CreatePoiPage/CreatePoiPage';
import EditPoiPage from 'src/pages/EditPoiPage/EditPoiPage';
import Exception404 from 'src/pages/Exception/404';
import PoiDetailPage from 'src/pages/PoiDetailPage/PoiDetailPage';
import PoiListPage from 'src/pages/PoiListPage/PoiListPage';

const PoiRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/list/:poiType?`}
        component={HasPermission([poi.list], PoiListPage)}
      />
      <Route
        path={`${match.url}/create`}
        component={HasPermission([poi.create], CreatePoiPage)}
      />
      <Route
        path={`${match.url}/:id/edit`}
        component={HasPermission([poi.update], EditPoiPage)}
      />
      <Route
        path={`${match.url}/:id/detail`}
        component={HasPermission([poi.update], PoiDetailPage)}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default PoiRoutes;
