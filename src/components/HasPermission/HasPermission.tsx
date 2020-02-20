import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import Exception403 from 'src/pages/Exception/403';
import {
  getApplicationPermissions,
  hasRequiredPermissions,
} from '../../selectors/auth.selector';

interface StateFromProps {
  permissions: any;
}
export default (
  requiredPermissions: string[],
  ChildComponent: React.ComponentType
) => {
  class ComposedComponent extends React.Component<StateFromProps> {
    public hasPermission() {
      const { permissions } = this.props;
      if (get(permissions, 'everything', false)) {
        return true;
      }
      return hasRequiredPermissions(requiredPermissions, permissions);
    }

    public render() {
      if (this.hasPermission()) {
        return <ChildComponent {...this.props} />;
      }
      return <Exception403 />;
    }
  }

  function mapStateToProps(state: any) {
    return {
      permissions: getApplicationPermissions(state),
    };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
