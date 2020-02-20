import * as React from 'react';

import { Icon } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { ApplicationState } from '../../reducers';
import { SessionState } from '../../reducers/auth.reducer';

import { User } from 'src/types/response/User';
import { actions } from '../../actions/auth.action';
import styles from './index.less';
import RightContent from './RightContent';

export interface OwnProps {
  isMobile: boolean;
  mobileLogo: string;
  collapsed: boolean;
  toggle: () => void;
}

interface StateProps {
  session?: SessionState;
  isLoading: boolean;
}

interface DispatchProps {
  actions: {
    logout: typeof actions.logout;
  };
}

type Props = OwnProps & StateProps & DispatchProps;

class Header extends React.Component<Props> {
  public handleMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      this.props.actions.logout();
    }
  };
  public render() {
    const {
      isMobile,
      mobileLogo,
      collapsed,
      toggle,
      session,
      isLoading,
    } = this.props;
    let userInfo: User | any = {};
    if (session) {
      userInfo = session.currentUser as User;
    }
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={mobileLogo} alt="logo" width="32" />
          </Link>
        )}
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggle}
        />
        <RightContent
          currentUser={userInfo}
          isLoadingSession={isLoading}
          onMenuClick={this.handleMenuClick}
        />
      </div>
    );
  }
}
const mapStateToprops = (state: ApplicationState): StateProps => {
  return {
    session: state.session,
    isLoading: state.session.isLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { logout } = actions;
  return {
    actions: bindActionCreators(
      {
        logout,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToprops,
  mapDispatchToProps
)(Header);
