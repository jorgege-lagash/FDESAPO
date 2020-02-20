import React from 'react';

import { Card, notification } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions as dealActions } from 'src/actions/deal.action';
import DealControlledForm from 'src/components/DealForm/DealControlledForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { getMallById } from 'src/selectors/mall.selector';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { Deal } from 'src/types/response/Deal';
import { DealTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  error?: any;
  isLoading: boolean;
  mallId: number;
  saved: boolean;
  timezone: string;
}

interface DispatchProps {
  actions: {
    createDeal: typeof dealActions.createEntity;
  };
}

type Props = StateProps & DispatchProps & InjectedIntlProps;

class CreateDealPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };

  public handleSubmit = (
    data: Deal,
    translations: TypedLooseObject<DealTranslationFormProps>
  ) => {
    this.props.actions.createDeal(this.props.mallId, data, translations);
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Oferta creada',
      description: 'Oferta creada correctamente',
    });
  };

  public handleFailure = (error: ApiError) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de crear la oferta.';
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
    const { mallId, timezone } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Crear Oferta'}>
        <Card>
          {this.state.redirect && <Redirect to={`${baseUrl}/deals/list`} />}
          <DealControlledForm
            mallId={mallId}
            timezone={timezone}
            onSubmit={this.handleSubmit}
            onSuccess={this.handleSuccess}
            onFailure={this.handleFailure}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (state: ApplicationState): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const mall = getMallById(state, state.malls.selectedMall || 0);
  const timezone = mall.timezone;
  return {
    mallId,
    saved: state.deals.saved,
    error: state.deals.error,
    isLoading: state.deals.isLoading,
    timezone,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        createDeal: dealActions.createEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreateDealPage);
export default injectIntl(connectedComponent, { withRef: true });
