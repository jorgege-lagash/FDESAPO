import React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import HasPermission from 'src/components/HasPermission/HasPermission';
import { category } from 'src/constants/permissions';
import CategoryDetailPage from 'src/pages/Category/CategoryDetailPage';
import CategoryListPage from 'src/pages/Category/CategoryListPage';
import CreateCategoryPage from 'src/pages/Category/CreateCategoryPage';
import EditCategoryPage from 'src/pages/Category/EditCategoryPage';
import Exception404 from 'src/pages/Exception/404';

const CategoryRoutes: React.SFC<RouteComponentProps> = ({ match }) => (
  <>
    <Switch>
      <Route
        path={`${match.url}/create`}
        component={HasPermission([category.create], CreateCategoryPage)}
      />
      <Route
        path={`${match.url}/list`}
        component={HasPermission([category.list], CategoryListPage)}
      />
      <Route
        path={`${match.url}/:id/edit`}
        component={HasPermission([category.update], EditCategoryPage)}
      />
      <Route
        path={`${match.url}/:id/detail`}
        component={HasPermission([category.update], CategoryDetailPage)}
      />
      <Route component={Exception404} />
    </Switch>
  </>
);
export default CategoryRoutes;
