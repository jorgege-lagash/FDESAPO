import { notification, Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { actions } from '../../actions/auth.action';
import logo from '../../assets/parauco-logo-black.svg';
import LoginForm from '../../components/LoginForm/LoginForm';
import CenteredContentLayout from '../../layouts/CenteredContentLayout';
import { ApplicationState } from '../../reducers';
import * as styles from './LoginPage.less';

interface StateProps {
  isAuthenticated: boolean;
  error?: any;
  isLoading: boolean;
}

interface DispatchProps {
  actions: {
    login: typeof actions.login;
  };
}

type LoginPageProps = StateProps & DispatchProps;

class LoginPage extends React.PureComponent<LoginPageProps> {
  public componentWillReceiveProps(nextProps: LoginPageProps) {
    const { error } = this.props;
    const { error: nextError } = nextProps;
    if (
      nextError &&
      error !== nextError &&
      (nextError.statusCode === 404 || nextError.statusCode === 400)
    ) {
      this.handleLoginFailure();
    }
  }

  public login = (user: string, password: string, remember: boolean) => {
    this.props.actions.login(user, password, remember);
  };
  public handleLoginFailure = () => {
    notification.error({
      message: 'Login Error',
      description: 'No se pudo iniciar sesion, usuario o password incorrectos.',
    });
  };
  public render() {
    const { isLoading, isAuthenticated } = this.props;
    return (
      <div className={styles.loginBackground}>
        <CenteredContentLayout>
          <div className={styles.loginCard}>
            <Spin spinning={isLoading} delay={100}>
              <img src={logo} className={styles.paraucoLogo} />
              <LoginForm loginAction={this.login} />
              {isAuthenticated && <Redirect to="/cms" />}
            </Spin>
          </div>
        </CenteredContentLayout>
        <div className={styles.version}>
          v{process.env.REACT_APP_APP_VERSION}
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    error: state.session.error,
    isAuthenticated: state.session.isAuthenticated,
    isLoading: state.session.isLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { login } = actions;
  return {
    actions: bindActionCreators({ login }, dispatch),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
export default connectedComponent;
