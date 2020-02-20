import * as React from 'react';
import { connect } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  withRouter,
} from 'react-router-dom';
import { ApplicationState } from '../../reducers';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  lang: string;
  component: React.ComponentType;
}

class PrivateRoute extends React.PureComponent<
  PrivateRouteProps & RouteComponentProps<any>
> {
  public displayComponent = (
    Component: React.ComponentType,
    routerProps: RouteProps
  ): JSX.Element => <Component {...routerProps} />;

  public redirectToLogin = (routerProps: RouteProps) => {
    return (
      <Redirect
        to={{ pathname: '/login', state: { from: routerProps.location } }}
      />
    );
  };

  public selectComponent = (routerProps: RouteProps) => {
    if (this.props.isAuthenticated) {
      return this.displayComponent(this.props.component, routerProps);
    }
    return this.redirectToLogin(routerProps);
  };

  public render = () => {
    const { component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        // tslint:disable-next-line:jsx-no-lambda
        render={(routerProps: RouteProps) => this.selectComponent(routerProps)}
      />
    );
  };
}
const mapStateToProps = (state: ApplicationState) => ({
  isAuthenticated: state.session.isAuthenticated,
  lang: state.locale.lang,
});
const connectedComponent = connect(
  mapStateToProps,
  null
)(PrivateRoute);
export default withRouter(connectedComponent) as typeof Route;
