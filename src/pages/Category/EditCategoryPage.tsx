import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import ControlledCategoryForm from 'src/components/CategoryForm/ControlledCategoryForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { TypedLooseObject } from 'src/types/LooseObject';
import { CategoryTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';
import { actions } from '../../actions/category.action';
import { ApplicationState } from '../../reducers';
import { Category } from '../../types/response/Category';

interface StateProps {
  isLoading: boolean;
  mallId: number;
  categoryId: number;
}

interface DispatchProps {
  actions: {
    updateCategory: typeof actions.updateEntity;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

class EditCategoryPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialCategory: {},
  };

  public handleSubmit = (
    data: Category,
    translations: TypedLooseObject<CategoryTranslationFormProps>
  ) => {
    const { categoryId } = this.props;
    this.props.actions.updateCategory(
      this.props.mallId,
      categoryId,
      data,
      translations
    );
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Categoria actualizada',
      description: 'Categoria actualizada correctamente',
    });
  };

  public handleFailure = (error: any) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de editar la categoria.';
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
    const { isLoading, mallId, categoryId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Editar Categoria'}>
        <Card>
          {this.state.redirect && (
            <Redirect to={`${baseUrl}/categories/list`} />
          )}
          <Spin spinning={isLoading}>
            <ControlledCategoryForm
              mallId={mallId}
              categoryId={categoryId}
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
  const categoryId = match.params.id;
  return {
    categoryId: Number(categoryId),
    isLoading: state.categories.isLoading,
    mallId: state.malls.selectedMall || 0,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updateEntity, fetchEntity } = actions;
  return {
    actions: bindActionCreators(
      {
        updateCategory: updateEntity,
        fetchCategory: fetchEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditCategoryPage);

export default withRouter(injectIntl(connectedComponent, { withRef: true }));
