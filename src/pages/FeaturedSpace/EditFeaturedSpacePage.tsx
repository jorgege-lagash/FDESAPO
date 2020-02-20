import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions } from 'src/actions/featured-space.action';
import ControlledFeaturedSpaceForm from 'src/components/FeaturedSpaceForm/ControlledFeaturedSpaceForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  isLoading: boolean;
  mallId: number;
  featuredSpaceId: number;
}

interface DispatchProps {
  actions: {
    updateFeaturedSpace: typeof actions.updateEntity;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

class EditFeaturedSpacePage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialFeaturedSpace: {},
  };

  public handleSubmit = (
    data: FeaturedSpace,
    translations: TypedLooseObject<FeaturedSpaceTranslationFormProps>
  ) => {
    const { featuredSpaceId } = this.props;
    this.props.actions.updateFeaturedSpace(
      this.props.mallId,
      featuredSpaceId,
      data,
      translations
    );
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Espacio publicitario actualizado',
      description: 'Espacio publicitario actualizado correctamente',
    });
  };

  public handleFailure = (error: any) => {
    const { intl } = this.props;
    const defaultMessage =
      'Hubo un error al momento de editar el Espacio publicitario.';
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
    const { isLoading, mallId, featuredSpaceId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Editar Espacio publicitario'}>
        <Card>
          {this.state.redirect && (
            <Redirect to={`${baseUrl}/featured-space/list`} />
          )}
          <Spin spinning={isLoading}>
            <ControlledFeaturedSpaceForm
              mallId={mallId}
              featuredSpaceId={featuredSpaceId}
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
  const featuredSpaceId = match.params.id;
  return {
    featuredSpaceId: Number(featuredSpaceId),
    isLoading: state.categories.isLoading,
    mallId: state.malls.selectedMall || 0,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updateEntity, fetchEntity } = actions;
  return {
    actions: bindActionCreators(
      {
        updateFeaturedSpace: updateEntity,
        fetchFeaturedSpace: fetchEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditFeaturedSpacePage);

export default withRouter(injectIntl(connectedComponent, { withRef: true }));
