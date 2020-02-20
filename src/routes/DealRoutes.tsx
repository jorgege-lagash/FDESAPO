import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { deal } from 'src/constants/permissions';
import CreateDealPage from 'src/pages/Deal/CreateDealPage';
import DealDetailPage from 'src/pages/Deal/DealDetailPage';
import DealListPage from 'src/pages/Deal/DealListPage';
import UpdateDealPage from 'src/pages/Deal/EditDealPage';
import Exception404 from 'src/pages/Exception/404';

const DealRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/create`}
        component={HasPermission([deal.create], CreateDealPage)}
      />
      <Route
        path={`${match.url}/list`}
        component={HasPermission([deal.list], DealListPage)}
      />
      <Route
        path={`${match.url}/:id/edit`}
        component={HasPermission([deal.update], UpdateDealPage)}
      />
      <Route
        path={`${match.url}/:id/detail`}
        component={HasPermission([deal.update], DealDetailPage)}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default DealRoutes;
