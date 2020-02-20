import React from 'react';

import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as mallActions } from 'src/actions/mall.action';
import { ApplicationState } from 'src/reducers';

interface StateProps {
  mallId: number;
}

interface DispatchProps {
  actions: {
    selectMall: typeof mallActions.selectMall;
  };
}

interface OwnState {
  redirect: boolean;
  mallId: number;
}

export type Props = DispatchProps &
  StateProps &
  RouteComponentProps<{ id: string }>;

class RedirectToMall extends React.Component<Props> {
  public state: OwnState = {
    redirect: false,
    mallId: 0,
  };

  public componentDidMount = () => {
    const { match, mallId, actions } = this.props;
    const mallIdFromURL = Number(match.params.id);
    if (mallIdFromURL && mallIdFromURL !== mallId) {
      actions.selectMall(mallIdFromURL);
    }
  };

  public componentDidUpdate(prevProps: Props) {
    const { mallId, match, actions } = this.props;
    const mallIdFromURL = Number(match.params.id);

    if (this.state.redirect) {
      this.setState({ redirect: false });
    }
    if (mallIdFromURL && mallId && mallIdFromURL !== mallId) {
      actions.selectMall(mallId);
      this.setState({ redirect: true, mallId });
    }
    if (!mallIdFromURL && mallId) {
      actions.selectMall(mallId);
      this.setState({ redirect: true, mallId });
    }
  }
  public render() {
    const { children } = this.props;
    const shouldRedirect = this.state.redirect;

    return (
      <>
        {shouldRedirect && <Redirect to={`/cms/mall/${this.state.mallId}`} />}
        {children}
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    mallId: state.malls.selectedMall || 0,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        selectMall: mallActions.selectMall,
      },
      dispatch
    ),
  };
};

const EnhancedComponent = withRouter(
  connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(RedirectToMall)
);
export default EnhancedComponent;

export const RedirectToMallHOC = (
  Component: React.ComponentType,
  componentProps: any = {}
) => (props: any) => (
  <EnhancedComponent>
    <Component {...componentProps} />
  </EnhancedComponent>
);
