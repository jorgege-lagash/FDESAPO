import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { poiMallZone } from 'src/constants/permissions';
// import CreatePoiPage from 'src/pages/CreatePoiPage/CreatePoiPage';
// import EditPoiPage from 'src/pages/EditPoiPage/EditPoiPage';
import Exception404 from 'src/pages/Exception/404';
// import PoiDetailPage from 'src/pages/PoiDetailPage/PoiDetailPage';
import PoiMallZoneListPage from 'src/pages/PoiMallZone/PoiMallZoneListPage';
import CreatePoiMallZonePage from 'src/pages/PoiMallZone/CreatePoiMallZonePage';

const PoiMallZoneRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/list/:poiType?`}
        component={HasPermission([poiMallZone.list], PoiMallZoneListPage)}
      />
      <Route
        path={`${match.url}/create`}
        component={HasPermission([poiMallZone.create], CreatePoiMallZonePage)}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default PoiMallZoneRoutes;
