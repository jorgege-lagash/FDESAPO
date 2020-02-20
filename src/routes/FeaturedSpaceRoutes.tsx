import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { featuredSpace } from 'src/constants/permissions';
import Exception404 from 'src/pages/Exception/404';
import CreateFeaturedSpacePage from 'src/pages/FeaturedSpace/CreateFeaturedSpacePage';
import EditFeaturedSpacePage from 'src/pages/FeaturedSpace/EditFeaturedSpacePage';
import FeaturedSpaceDetailPage from 'src/pages/FeaturedSpace/FeaturedSpaceDetailPage';
import FeaturedSpaceListPage from 'src/pages/FeaturedSpace/FeaturedSpaceListPage';

const FeaturedSpaceRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/create`}
        component={HasPermission(
          [featuredSpace.create],
          CreateFeaturedSpacePage
        )}
      />
      <Route
        path={`${match.url}/list`}
        component={HasPermission([featuredSpace.list], FeaturedSpaceListPage)}
      />
      <Route
        path={`${match.url}/:id/edit`}
        component={HasPermission([featuredSpace.update], EditFeaturedSpacePage)}
      />
      <Route
        path={`${match.url}/:id/detail`}
        component={HasPermission(
          [featuredSpace.update],
          FeaturedSpaceDetailPage
        )}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default FeaturedSpaceRoutes;
