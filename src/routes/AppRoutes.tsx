import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import loadable from 'react-loadable';
import { Route, Switch } from 'react-router';
import { LoadingComponent } from 'src/components/LoadingComponent/LoadingComponent';
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute';
import { setIntl } from 'src/utils/intl.utils';

const AsyncCMSRoutes = loadable({
  loader: () => import('src/routes/DashboardRoutes'),
  loading: LoadingComponent,
});

const AsyncLoginPage = loadable({
  loader: () => import('src/pages/Login/LoginPage'),
  loading: LoadingComponent,
});

interface OwnProps {
  initialHistory: History;
}

type Props = OwnProps & InjectedIntlProps;

class AppRoutes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    setIntl(props.intl);
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.intl !== this.props.intl) {
      setIntl(this.props.intl);
    }
  }

  public render() {
    const { initialHistory } = this.props;
    return (
      <ConnectedRouter history={initialHistory}>
        <Switch>
          <PrivateRoute path="/cms" component={AsyncCMSRoutes} />
          <Route path="/login" component={AsyncLoginPage} />
          <Route component={AsyncLoginPage} />
        </Switch>
      </ConnectedRouter>
    );
  }
}

export default injectIntl(AppRoutes, { withRef: true });
