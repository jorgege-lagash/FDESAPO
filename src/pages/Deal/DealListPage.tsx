import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  notification,
  Row,
  Select,
  Spin,
} from 'antd';
import { get } from 'lodash';
import debounce from 'lodash/debounce';
import { Moment } from 'moment';
import moment from 'moment';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { actions } from 'src/actions/deal.action';
import { DealList } from 'src/components/DealList/DealList';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import {
  getDenormalizedDeals,
  getFormatedDeals,
} from 'src/selectors/deal.selector';
import { getMallById } from 'src/selectors/mall.selector';
import { LooseObject } from 'src/types/LooseObject';
import { FormatedDeal } from 'src/types/response/Deal';
import { Poi } from 'src/types/response/POI';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';
import { dateFormat } from 'src/utils/event-directory.utils';
import { HttpService } from 'src/utils/request';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface StateProps {
  deals: FormatedDeal[];
  mallId: number;
  total: number;
  currentPage: number;
  isLoading: boolean;
  error: any;
}

interface DispatchProps {
  actions: {
    fetchDealList: typeof actions.fetchDealList;
    deleteDeal: typeof actions.deleteEntity;
  };
}

interface QueryObject {
  name?: any;
  fromDate?: any;
  toDate?: any;
  poiId: any;
  orderBy?: any;
}

interface OwnState {
  page?: number;
  limit?: number;
  queryData: LooseObject;
  query?: { filter: any; sort: any };
  fromDate?: Moment;
  toDate?: Moment;
  pois: Poi[];
  fetching: boolean;
  poiTerm: string;
  poiId?: number;
}
type Props = StateProps &
  DispatchProps &
  InjectedIntlProps &
  RouteComponentProps<{ dealType?: string }>;

class DealListPage extends React.PureComponent<Props, OwnState> {
  public state: OwnState = {
    page: 1,
    limit: 10,
    queryData: {},
    query: undefined,
    fromDate: undefined,
    toDate: undefined,
    pois: [],
    fetching: false,
    poiTerm: '',
    poiId: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.fetchPois = debounce(this.fetchPois, 600);
  }

  public componentDidMount() {
    this.fetchPois();
    const { actions: dispatchActions, mallId } = this.props;
    dispatchActions.fetchDealList(mallId, 1, 10);
  }

  public componentDidUpdate(prevProps: Props, prevState: OwnState) {
    const { page, limit } = this.state;
    const { mallId, actions: dispatchActions, error, intl } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchDealList(mallId, page || 1, limit || 10);
    }

    if (error && error !== prevProps.error) {
      const content = buildErrorMessageContent(
        'Algo salio mal',
        error,
        intl,
        'deal.label'
      );
      notification.warn({
        message: 'Advertencia',
        description: content,
        duration: 10,
      });
    }
  }

  public fetchPois = async (value: string = '') => {
    const { mallId } = this.props;
    const dealHeader = { 'a-mall-id': mallId };
    const dealOptions = { query: { name: value, limit: 100 } };
    const { data: pois } = await HttpService.get(
      'pois',
      dealOptions,
      dealHeader
    );
    this.setState({ pois, fetching: false, poiTerm: value });
  };

  public handleBlur = () => {
    this.setState({ poiTerm: '' });
  };

  public renderSearchText = (text: string = '', searchText: string = '') => {
    return searchText ? (
      <span>
        {text
          .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))
          .map((fragment: string, i: any) =>
            fragment.toLowerCase() === searchText.toLowerCase() ? (
              <span key={i} className="highlight">
                {fragment}
              </span>
            ) : (
              fragment
            )
          )}
      </span>
    ) : (
      text
    );
  };

  public handleKey = () => {
    this.setState({ fetching: true, pois: [] });
  };

  public confirmDeleteDeal = (id: number) => {
    Modal.confirm({
      title: 'Eliminar Oferta',
      content:
        '¿Está seguro que desea eliminar esta oferta? \n Si elimina esta oferta también será eliminada de las tiendas relacionadas, esta operación es irreversible.',
      okText: 'Si estoy seguro',
      cancelText: 'No',
      onOk: () => this.handleDelete(id),
    });
  };

  public handleDelete = (id: number) => {
    const { mallId, actions: dealActions } = this.props;
    dealActions.deleteDeal(mallId, id);
    notification.success({
      message: 'Oferta eliminada',
      description: 'Oferta eliminada correctamente',
    });
  };

  public handlePoiChange = (value: any) => {
    const poiId = value ? Number(value.key) : undefined;
    const { mallId, actions: dispatchActions } = this.props;
    const { query, limit, fromDate, toDate } = this.state;
    const page = 1;

    const queryData = this.createQueryObject(query, fromDate, toDate, poiId);
    this.setState({
      page,
      queryData,
      query,
      poiId,
    });

    dispatchActions.fetchDealList(mallId, page, limit || 10, queryData);
  };

  public handleChange = (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => {
    const { mallId, actions: dispatchActions } = this.props;
    const { fromDate, toDate, poiId } = this.state;
    const queryData = this.createQueryObject(query, fromDate, toDate, poiId);
    this.setState({ page, limit, queryData, query });
    dispatchActions.fetchDealList(mallId, page || 1, limit || 10, queryData);
  };

  public createQueryObject = (
    query?: { filter: any; sort: any },
    fromDate?: Moment,
    toDate?: Moment,
    poiId?: number
  ) => {
    if (query) {
      const { filter, sort } = query;
      return {
        ...(filter.title &&
          filter.title !== '' &&
          filter.title.length > 0 && { title: filter.title }),
        ...(filter.states && { states: JSON.stringify(filter.states) }),
        ...(fromDate && { fromDate: fromDate.format(dateFormat) }),
        ...(toDate && {
          toDate: toDate.format(dateFormat),
        }), // one dayy added to include the last day
        ...(poiId && { poiId }),
        ...(sort &&
          sort.field && {
            orderBy: `${sort.field} ${
              sort.order === 'ascend' ? 'ASC' : 'DESC'
            }`,
          }),
      };
    }
    const { fromDate: fd, toDate: td, poiId: pId, ...newQuery } = this.state
      .queryData as QueryObject;

    return {
      ...newQuery,
      ...(fromDate && { fromDate: fromDate.format(dateFormat) }),
      ...(toDate && { toDate: toDate.format(dateFormat) }),
      ...(poiId && { poiId }),
    };
  };

  public onChangeDate = (dates: [Moment, Moment]): void => {
    const { mallId, actions: dispatchActions } = this.props;
    const { query, limit, poiId } = this.state;
    const page = 1;
    const [fromDate, toDate] = dates;

    const queryData = this.createQueryObject(query, fromDate, toDate, poiId);
    this.setState({
      page,
      queryData,
      query,
      fromDate,
      toDate,
    });

    dispatchActions.fetchDealList(mallId, page, limit || 10, queryData);
  };

  public render() {
    const { total, isLoading, mallId, currentPage, match } = this.props;
    const { fetching, pois, poiTerm } = this.state;
    const data: FormatedDeal[] = this.props.deals || [];
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    return (
      <PageHeaderWrapper title={'Lista de Ofertas'}>
        <Card>
          <div className="table-list-operator-row">
            <Link to={`${baseUrl}/deals/create`}>
              <Button type="primary" icon="plus">
                Nuevo
              </Button>
            </Link>
          </div>
          <div className="gutter">
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <div className="table-list-operator-row">
                  Filtrar por fecha:{' '}
                  <RangePicker
                    onChange={this.onChangeDate}
                    format="DD-MM-YYYY"
                  />
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div className="table-list-operator-row">
                  POI:{' '}
                  <Select
                    allowClear={true}
                    filterOption={false}
                    labelInValue={true}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    onBlur={this.handleBlur}
                    onChange={this.handlePoiChange}
                    onInputKeyDown={this.handleKey}
                    onSearch={this.fetchPois}
                    placeholder="Digitar nombre de POI"
                    showSearch={true}
                    style={{ width: '80%' }}>
                    {pois.map((poiE) => (
                      <Option key={`${poiE.id}`}>
                        {this.renderSearchText(poiE.name, poiTerm)}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
          </div>

          <DealList
            returnUrl={returnUrl}
            baseUrl={baseUrl}
            loading={isLoading}
            currentPage={currentPage}
            deals={data}
            total={total}
            onChange={this.handleChange}
            deleteElement={this.confirmDeleteDeal}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchDealList, deleteEntity } = actions;
  return {
    actions: bindActionCreators(
      {
        fetchDealList,
        deleteDeal: deleteEntity,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const page = state.deals.page;
  const ids = get(state.deals, `pages[${page}]`, []);
  const denorm = getDenormalizedDeals(state, ids);
  const mall = getMallById(state, mallId || 0);
  const { timezone } = mall;
  const today = moment()
    .tz(timezone)
    .startOf('day');
  return {
    mallId,
    deals: getFormatedDeals(denorm, today),
    total: state.deals.total,
    currentPage: page,
    isLoading: state.deals.isLoading,
    error: state.deals.error,
  };
};

export default withRouter(
  injectIntl(
    connect<StateProps, DispatchProps>(
      mapStateToProps,
      mapDispatchToProps
    )(DealListPage),
    {
      withRef: true,
    }
  )
);
