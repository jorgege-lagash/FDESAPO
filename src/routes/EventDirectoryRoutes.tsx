import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { event } from 'src/constants/permissions';
import CreateEventDirectoryPage from 'src/pages/EventDirectory/CreateEventDirectoryPage';
import EditEventDirectoryPage from 'src/pages/EventDirectory/EditEventDirectoryPage';
import EventDirectoryDetailPage from 'src/pages/EventDirectory/EventDirectoryDetailPage';
import EventDirectoryListPage from 'src/pages/EventDirectory/EventDirectoryListPage';
import Exception404 from 'src/pages/Exception/404';

const EventDirectoryRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/create`}
        component={HasPermission([event.create], CreateEventDirectoryPage)}
      />
      <Route
        path={`${match.url}/list`}
        component={HasPermission([event.list], EventDirectoryListPage)}
      />
      <Route
        path={`${match.url}/:id/edit`}
        component={HasPermission([event.update], EditEventDirectoryPage)}
      />
      <Route
        path={`${match.url}/:id/detail`}
        component={HasPermission([event.update], EventDirectoryDetailPage)}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default EventDirectoryRoutes;
