import React from 'react';

import { Card, notification } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions as featuredSpaceActions } from 'src/actions/featured-space.action';
import ControlledFeaturedSpaceForm from 'src/components/FeaturedSpaceForm/ControlledFeaturedSpaceForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  error?: any;
  isLoading: boolean;
  mallId: number;
  saved: boolean;
}

interface DispatchProps {
  actions: {
    createFeaturedSpace: typeof featuredSpaceActions.createEntity;
  };
}

type Props = StateProps & DispatchProps & InjectedIntlProps;

class CreateFeaturedSpacePage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };

  public handleSubmit = (
    data: FeaturedSpace,
    translations: TypedLooseObject<FeaturedSpaceTranslationFormProps>
  ) => {
    this.props.actions.createFeaturedSpace(
      this.props.mallId,
      data,
      translations
    );
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Espacio publicitario creado',
      description: 'Espacio publicitario creado correctamente',
    });
  };

  public handleFailure = (error: ApiError) => {
    const { intl } = this.props;
    const defaultMessage =
      'Hubo un error al momento de crear el espacio publicitario.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'featuredSpace.label'
    );
    notification.error({
      message: 'Error',
      description: content,
    });
  };

  public render() {
    const { mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Crear Espacio publicitario'}>
        <Card>
          {this.state.redirect && (
            <Redirect to={`${baseUrl}/featured-space/list`} />
          )}
          <ControlledFeaturedSpaceForm
            mallId={mallId}
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
  return {
    mallId,
    saved: state.featuredSpaces.saved,
    error: state.featuredSpaces.error,
    isLoading: state.featuredSpaces.isLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        createFeaturedSpace: featuredSpaceActions.createEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreateFeaturedSpacePage);
export default injectIntl(connectedComponent, { withRef: true });
