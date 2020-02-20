import React from 'react';

import { Card, notification } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions as categoryActions } from 'src/actions/category.action';
import ControlledCategoryForm from 'src/components/CategoryForm/ControlledCategoryForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { Category } from 'src/types/response/Category';
import { CategoryTranslationFormProps } from 'src/types/TranslationForm';
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
    createCategory: typeof categoryActions.createEntity;
  };
}

type Props = StateProps & DispatchProps & InjectedIntlProps;

class CreateCategoryPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };

  public handleSubmit = (
    data: Category,
    translations: TypedLooseObject<CategoryTranslationFormProps>
  ) => {
    this.props.actions.createCategory(this.props.mallId, data, translations);
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Categoria creada',
      description: 'Categoria creada correctamente',
    });
  };

  public handleFailure = (error: ApiError) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de crear la categoria.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'category.label'
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
      <PageHeaderWrapper title={'Crear Categoria'}>
        <Card>
          {this.state.redirect && (
            <Redirect to={`${baseUrl}/categories/list`} />
          )}
          <ControlledCategoryForm
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
    saved: state.categories.saved,
    error: state.categories.error,
    isLoading: state.categories.isLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        createCategory: categoryActions.createEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreateCategoryPage);
export default injectIntl(connectedComponent, { withRef: true });
