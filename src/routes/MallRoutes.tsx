import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { mall } from 'src/constants/permissions/mall';
import CreateMallPage from 'src/pages/CreateMall/CreateMallPage';
import Exception404 from 'src/pages/Exception/404';
import MallDetailPage from 'src/pages/MallDetailPage/MallDetailPage';
import MallListPage from 'src/pages/MallListPage/MallListPage';
import TermsOfServicePage from 'src/pages/TermsOfServicePage/TermsOfServicePage';
import UpdateMallPage from 'src/pages/UpdateMall/UpdateMallPage';

// * /malls
const MallRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/create`}
        component={HasPermission([mall.create], CreateMallPage)}
      />
      <Route
        path={`${match.url}/:id/update`}
        component={HasPermission([mall.update], UpdateMallPage)}
      />
      <Route
        path={`${match.url}/:id/detail`}
        component={HasPermission([mall.view], MallDetailPage)}
      />
      <Route
        path={`${match.url}/:id/terms`}
        component={HasPermission([mall.view], TermsOfServicePage)}
      />
      <Route path={`${match.url}/list`} component={MallListPage} />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default MallRoutes;
