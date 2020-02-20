import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Card, Col, Modal, notification, Row, Select } from 'antd';
import { get } from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { actions as categoryActions } from 'src/actions/category.action';
import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import { actions } from 'src/actions/poi.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import { PoiList } from 'src/components/PoiList/PoiList';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getCategoriesByMallId } from 'src/selectors/category.selector';
import { getPoiTypeList } from 'src/selectors/poi-type.selector';
import { getDenormalizedPois } from 'src/selectors/poi.selector';
import messages from 'src/translations/default/messages';
import { LooseObject } from 'src/types/LooseObject';
import { Category } from 'src/types/response/Category';
import { Poi } from 'src/types/response/POI';
import { PoiType } from 'src/types/response/PoiType';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  pois: Poi[];
  mallId: number;
  total: number;
  currentPage: number;
  categories: Category[];
  poiTypes: PoiType[];
  isLoading: boolean;
  error: any;
}

interface DispatchProps {
  actions: {
    fetchPoiList: typeof actions.fetchPoiList;
    fetchPoiTypeList: typeof poiTypeActions.fetchEntityList;
    fetchCategoryList: typeof categoryActions.fetchPagedEntityList;
  };
}

interface OwnState {
  page?: number;
  limit?: number;
  poiTypeId: number;
  queryData: LooseObject;
}
type Props = StateProps &
  DispatchProps &
  InjectedIntlProps &
  RouteComponentProps<{ poiType?: string }>;

class PoiListPage extends React.PureComponent<Props, OwnState> {
  public state: OwnState = {
    page: 1,
    limit: 10,
    poiTypeId: 0,
    queryData: {},
  };
  public componentDidMount() {
    const { actions: dispatchActions, mallId, match } = this.props;
    dispatchActions.fetchCategoryList(mallId, 1, 1000);
    if (match.params.poiType) {
      const poiTypeId = Number(match.params.poiType) || 0;
      this.setState({ poiTypeId }, () => {
        dispatchActions.fetchPoiList(
          mallId,
          1,
          this.state.limit,
          this.createQueryObject()
        );
      });
    } else {
      dispatchActions.fetchPoiList(mallId, 1, 10);
      dispatchActions.fetchPoiTypeList(mallId);
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: OwnState) {
    const { page, limit } = this.state;
    const { mallId, actions: dispatchActions, error, intl, match } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchPoiList(mallId, page, limit);
      dispatchActions.fetchPoiTypeList(mallId);
      dispatchActions.fetchCategoryList(mallId, 1, 1000);
    }
    if (prevState.poiTypeId !== this.state.poiTypeId) {
      dispatchActions.fetchPoiList(mallId, 1, limit, this.createQueryObject());
    }
    if (prevProps.match.params.poiType !== match.params.poiType) {
      const poiTypeId = Number(match.params.poiType) || 0;
      this.setState({ poiTypeId });
    }
    if (error && error !== prevProps.error) {
      const content = buildErrorMessageContent(
        'Algo salio mal',
        error,
        intl,
        'store.label'
      );
      notification.warn({
        message: 'Advertencia',
        description: content,
        duration: 10,
      });
    }
  }

  public confirmDeletePoi = (poiId: number) => {
    Modal.confirm({
      title: 'Eliminar POI',
      content: 'Esta seguro que desea eliminar este POI?',
      okText: 'Si estoy seguro',
      cancelText: 'No',
      onOk: () => this.handleDeletePoi(poiId),
    });
  };

  public handleDeletePoi = (poiId: number) => {
    throw new Error('Not implemented');
  };

  public createQueryObject = (query?: { filter: any; sort: any }) => {
    if (query) {
      const { filter, sort } = query;
      return {
        ...(this.state.poiTypeId > 0 && { poiTypeId: this.state.poiTypeId }),
        ...(filter.categories &&
          filter.categories.length > 0 && {
            categories: JSON.stringify(filter.categories),
          }),
        ...(filter.name && { name: filter.name[0] }),
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
      ...(this.state.poiTypeId > 0 && { poiTypeId: this.state.poiTypeId }),
    };
  };

  public handleChange = (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => {
    const { mallId, actions: dispatchActions } = this.props;
    const queryData = this.createQueryObject(query);
    this.setState({ page, limit, queryData });
    dispatchActions.fetchPoiList(mallId, page, limit, queryData);
  };

  public handlePoiTypeChange = (poiTypeId: any) => {
    this.setState({ poiTypeId });
  };

  public tableFilters = () => {
    const { poiTypes, intl, match } = this.props;
    if (match.params.poiType) {
      return <></>;
    }
    return (
      <Row gutter={16}>
        <Col sm={4} style={{ textAlign: 'end' }}>
          Tipo de Poi:
        </Col>
        <Col sm={6}>
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage(messages.store.label.poiType)}
            onChange={this.handlePoiTypeChange}>
            <Select.Option key={'0'} value={0}>
              Todos
            </Select.Option>
            {poiTypes.map((p) => (
              <Select.Option key={`${p.id}`} value={p.id}>
                {`${p.name}`}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    );
  };

  public render() {
    const { total, isLoading, mallId, currentPage, match } = this.props;
    const data: Poi[] = this.props.pois || [];
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    return (
      <PageHeaderWrapper title={'Lista de POIs'} content={this.tableFilters()}>
        <Card>
          <PermissionCheck permission={[AppPermissions.poi.create]}>
            <div className="table-list-operator-row">
              <Link to={`${baseUrl}/pois/create`}>
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>

          <PoiList
            returnUrl={returnUrl}
            baseUrl={baseUrl}
            loading={isLoading}
            currentPage={currentPage}
            pois={data}
            categories={this.props.categories}
            total={total}
            onChange={this.handleChange}
            deleteElement={this.confirmDeletePoi}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchPoiList } = actions;
  return {
    actions: bindActionCreators(
      {
        fetchPoiList,
        fetchPoiTypeList: poiTypeActions.fetchEntityList,
        fetchCategoryList: categoryActions.fetchPagedEntityList,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const page = state.pois.page;
  const ids = get(state.pois, `pages[${page}]`, []);
  const denorm = getDenormalizedPois(state, ids);
  return {
    mallId,
    pois: denorm,
    total: state.pois.total,
    currentPage: page,
    categories: getCategoriesByMallId(state, mallId),
    isLoading: state.pois.isLoading,
    poiTypes: getPoiTypeList(state),
    error: state.pois.error,
  };
};

export default withRouter(
  injectIntl(
    connect<StateProps, DispatchProps>(
      mapStateToProps,
      mapDispatchToProps
    )(PoiListPage),
    {
      withRef: true,
    }
  )
);
