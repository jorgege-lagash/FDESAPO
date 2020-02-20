import React from 'react';

import { Card, notification, Spin } from 'antd';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { actions } from 'src/actions/mall.action';
import { actions as termsOfServiceActions } from 'src/actions/terms-of-service.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { TermsOfServiceForm } from 'src/components/TermsOfServiceForm/TermsOfServiceForm';
import { ApplicationState } from 'src/reducers';
import { getMallById } from 'src/selectors/mall.selector';
import { getTermByMallId } from 'src/selectors/terms.selector';
import { Mall } from 'src/types/Mall';
import { TermsOfService } from 'src/types/response/TermsOfService';

interface StateProps {
  error?: any;
  isLoading: boolean;
  saved: boolean;
  mallId: number;
  mall: Mall;
  term: TermsOfService | null;
}

interface DispatchProps {
  actions: {
    fetchMallList: typeof actions.fetchMallList;
    fetchTermsOfServiceList: typeof termsOfServiceActions.fetchTermsOfServiceList;
    updateTermsOfService: typeof termsOfServiceActions.updateTermsOfService;
  };
}

type Props = StateProps & DispatchProps & RouteComponentProps<{ id: string }>;

export class TermsOfServicePage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };
  constructor(props: Props) {
    super(props);

    if (!props.mall) {
      props.actions.fetchMallList();
    }
    if (!props.term) {
      props.actions.fetchTermsOfServiceList(props.mallId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { saved, isLoading, error } = this.props;
    if (prevProps.isLoading && isLoading === false) {
      if (!prevProps.saved && saved) {
        notification.success({
          message: 'Terminos actualizados',
          description: 'Terminos y condiciones  actualizados correctamente',
        });
        this.setState({
          redirect: true,
        });
      }
      if (!prevProps.error && error) {
        notification.error({
          message: 'Error',
          description:
            'Hubo un error al momento de actualizar los terminos y condiciones. intente nuevamente.',
        });
      }
    }
  }

  public handleSave = (text: string) => {
    const { term, mallId } = this.props;
    const terms: TermsOfService = term
      ? {
          ...term,
          text,
        }
      : ({
          id: 0,
          mallId,
          active: true,
          text,
          tag: 'default',
        } as TermsOfService);
    return this.props.actions.updateTermsOfService(this.props.mallId, terms);
  };

  public render() {
    const { term, isLoading, mall } = this.props;
    return this.state.redirect ? (
      <Redirect to="/cms/malls/list" />
    ) : (
      <PageHeaderWrapper title={'Terminos y condiciones'}>
        <Card>
          <strong>Mall:</strong>
          {` ${mall ? mall.name : ''}`}
          <br />
          <br />
          <Spin spinning={isLoading}>
            <TermsOfServiceForm
              onSave={this.handleSave}
              terms={term ? term.text : ''}
            />
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const mallId = Number(props.match.params.id);
  return {
    error: state.terms.error,
    isLoading: state.terms.isLoading,
    saved: state.terms.saved,
    mallId,
    term: get(getTermByMallId(state, `${mallId}`), '[0]', null),
    mall: getMallById(state, props.match.params.id),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchMallList, updateMallTerms } = actions;
  const {
    fetchTermsOfServiceList,
    updateTermsOfService,
  } = termsOfServiceActions;
  return {
    actions: bindActionCreators(
      {
        fetchMallList,
        updateMallTerms,
        fetchTermsOfServiceList,
        updateTermsOfService,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(TermsOfServicePage);

export default withRouter(connectedComponent);
