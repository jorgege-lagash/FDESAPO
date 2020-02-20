import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Card, Modal, notification } from 'antd';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { actions as categoryActions } from 'src/actions/category.action';
import { CategoryList } from 'src/components/CategoryList/CategoryList';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getCategoriesByMallId } from 'src/selectors/category.selector';
import { Category } from 'src/types/response/Category';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  categories: Category[];
  mallId: number;
  error: any;
}

interface DispatchProps {
  actions: {
    fetchCategoryList: typeof categoryActions.fetchPagedEntityList;
    deleteCategory: typeof categoryActions.deleteEntity;
  };
}

type Props = StateProps &
  DispatchProps &
  InjectedIntlProps &
  RouteComponentProps;

class CategoryListPage extends React.PureComponent<Props> {
  public componentDidMount() {
    const { actions: dispatchActions, mallId } = this.props;
    dispatchActions.fetchCategoryList(mallId, 1, 1000);
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, actions: dispatchActions, error, intl } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchCategoryList(mallId, 1, 1000);
    }

    if (error && error !== prevProps.error) {
      const content = buildErrorMessageContent(
        'Algo salio mal',
        error,
        intl,
        'category.label'
      );
      notification.warn({
        message: 'Advertencia',
        description: content,
        duration: 8,
      });
    }
  }

  public confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Eliminar Categoria',
      content:
        'Esta seguro que desea eliminar esta Categoria?\n si elimina esta categoria tambien sera eliminada de las tiendas relacionadas, esta operacion es irreversible',
      okText: 'Si estoy seguro',
      cancelText: 'No',
      onOk: () => this.handleDelete(id),
    });
  };

  public handleDelete = (id: number) => {
    const { mallId, actions } = this.props;
    actions.deleteCategory(mallId, id);
  };

  public render() {
    const data: Category[] = this.props.categories || [];
    const baseUrl = createMallDependentUrl(this.props.mallId, '');
    return (
      <PageHeaderWrapper title={'Lista de Categorias'}>
        <Card>
          <PermissionCheck permission={[AppPermissions.category.create]}>
            <div className="table-list-operator-row">
              <Link to={`${baseUrl}/categories/create`}>
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>

          <CategoryList
            baseUrl={baseUrl}
            categories={data}
            deleteElement={this.confirmDelete}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchCategoryList: categoryActions.fetchPagedEntityList,
        deleteCategory: categoryActions.deleteEntity,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const error = state.categories.error;
  return {
    mallId,
    categories: getCategoriesByMallId(state, mallId || 0),
    error,
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CategoryListPage);

export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
