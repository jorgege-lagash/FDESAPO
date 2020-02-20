import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { zone } from 'src/constants/permissions';
import CreateZonePage from 'src/pages/CreateZonePage/CreateZonePage';
import EditZonePage from 'src/pages/EditZonePage/EditZonePage';
import Exception404 from 'src/pages/Exception/404';
import ZoneListPage from 'src/pages/ZoneListPage/ZoneListPage';

const ZoneRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/create`}
        component={HasPermission([zone.create], CreateZonePage)}
      />
      <Route
        path={`${match.url}/list`}
        component={HasPermission([zone.list], ZoneListPage)}
      />
      <Route
        path={`${match.url}/:id/edit`}
        component={HasPermission([zone.update], EditZonePage)}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default ZoneRoutes;
