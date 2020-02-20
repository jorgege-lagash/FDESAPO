import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import DealControlledForm from 'src/components/DealForm/DealControlledForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { getMallById } from 'src/selectors/mall.selector';
import { TypedLooseObject } from 'src/types/LooseObject';
import { DealTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';
import { actions } from '../../actions/deal.action';
import { ApplicationState } from '../../reducers';
import { Deal } from '../../types/response/Deal';

interface StateProps {
  isLoading: boolean;
  mallId: number;
  dealId: number;
  timezone: string;
}

interface DispatchProps {
  actions: {
    updateDeal: typeof actions.updateEntity;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

class EditDealPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialEventDirectory: {},
  };

  public handleSubmit = (
    data: Deal,
    translations: TypedLooseObject<DealTranslationFormProps>
  ) => {
    const { dealId } = this.props;
    this.props.actions.updateDeal(
      this.props.mallId,
      dealId,
      data,
      translations
    );
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Oferta actualizada',
      description: 'Oferta actualizada correctamente',
    });
  };

  public handleFailure = (error: any) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de editar oferta.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'deal.label'
    );
    notification.error({
      message: 'Error',
      description: content,
    });
  };

  public render() {
    const { isLoading, mallId, dealId, timezone } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Editar Oferta'}>
        <Card>
          {this.state.redirect && <Redirect to={`${baseUrl}/deals/list`} />}
          <Spin spinning={isLoading}>
            <DealControlledForm
              mallId={mallId}
              dealId={dealId}
              timezone={timezone}
              onSubmit={this.handleSubmit}
              onSuccess={this.handleSuccess}
              onFailure={this.handleFailure}
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
  const { match } = props;
  const dealId = match.params.id;
  const mall = getMallById(state, state.malls.selectedMall || 0);
  const timezone = mall.timezone;
  return {
    dealId: Number(dealId),
    isLoading: state.deals.isLoading,
    mallId: state.malls.selectedMall || 0,
    timezone,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updateEntity, fetchEntity } = actions;
  return {
    actions: bindActionCreators(
      {
        updateDeal: updateEntity,
        fetchDeal: fetchEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditDealPage);

export default withRouter(injectIntl(connectedComponent, { withRef: true }));
