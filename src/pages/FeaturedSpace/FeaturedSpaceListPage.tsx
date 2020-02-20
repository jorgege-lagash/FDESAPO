import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Card, Modal, notification } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { actions as featuredSpaceActions } from 'src/actions/featured-space.action';
import { FeaturedSpaceList } from 'src/components/FeaturedSpaceList/FeaturedSpaceList';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getDenormalizedFeaturedSpaces } from 'src/selectors/featured-space.selector';
import { LooseObject } from 'src/types/LooseObject';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { createMallDependentUrl } from 'src/utils';

interface StateProps {
  featuredSpaces: FeaturedSpace[];
  mallId: number;
  total: number;
}

interface DispatchProps {
  actions: {
    fetchFeaturedSpaceList: typeof featuredSpaceActions.fetchPagedEntityList;
    deleteFeaturedSpace: typeof featuredSpaceActions.deleteEntity;
  };
}

interface OwnState {
  page?: number;
  limit?: number;
  queryData: LooseObject;
  query?: { filter: any; sort: any };
}

type Props = StateProps & DispatchProps;

class FeaturedSpaceListPage extends React.PureComponent<Props, OwnState> {
  public state = {
    page: 1,
    limit: 10,
    queryData: {},
    query: undefined,
  };

  public componentDidMount() {
    const { actions: dispatchActions, mallId } = this.props;
    dispatchActions.fetchFeaturedSpaceList(mallId, 1, 10);
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, actions: dispatchActions } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchFeaturedSpaceList(mallId, 1, 10);
    }
  }

  public confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Eliminar Espacio publicitario',
      content:
        'Esta seguro que desea eliminar este Elemento?\n esta operacion es irreversible',
      okText: 'Si estoy seguro',
      cancelText: 'No',
      onOk: () => this.handleDelete(id),
    });
  };

  public handleDelete = (id: number) => {
    const { mallId, actions } = this.props;
    actions.deleteFeaturedSpace(mallId, id);
    notification.success({
      message: 'Oferta eliminada',
      description: 'Oferta eliminada correctamente',
    });
  };

  public handleChange = (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => {
    const { mallId, actions: dispatchActions } = this.props;
    const queryData = this.createQueryObject(query);
    this.setState({ page, limit, queryData, query });
    dispatchActions.fetchFeaturedSpaceList(
      mallId,
      page || 1,
      limit || 10,
      queryData
    );
  };

  public createQueryObject = (query?: { filter: any; sort: any }) => {
    if (query) {
      const { filter, sort } = query;
      return {
        ...(filter.name && { name: filter.name }),
        ...(sort &&
          sort.field && {
            orderBy: `${sort.field} ${
              sort.order === 'ascend' ? 'ASC' : 'DESC'
            }`,
          }),
      };
    }
    return {
      ...this.state.queryData,
    };
  };

  public render() {
    const data: FeaturedSpace[] = this.props.featuredSpaces || [];
    const { total } = this.props;
    const baseUrl = createMallDependentUrl(this.props.mallId, '');
    return (
      <PageHeaderWrapper title={'Lista de Espacios publicitarios'}>
        <Card>
          <PermissionCheck permission={[AppPermissions.featuredSpace.create]}>
            <div className="table-list-operator-row">
              <Link to={`${baseUrl}/featured-space/create`}>
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>

          <FeaturedSpaceList
            baseUrl={baseUrl}
            data={data}
            total={total}
            deleteElement={this.confirmDelete}
            onChange={this.handleChange}
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
        fetchFeaturedSpaceList: featuredSpaceActions.fetchPagedEntityList,
        deleteFeaturedSpace: featuredSpaceActions.deleteEntity,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const page = state.featuredSpaces.page;
  const ids = get(state.featuredSpaces, `pages[${page}]`, []);
  const denorm = getDenormalizedFeaturedSpaces(state, ids);
  const validDenorm = denorm.filter((item) => item);
  return {
    mallId,
    total: state.featuredSpaces.total,
    featuredSpaces: validDenorm,
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(FeaturedSpaceListPage);
