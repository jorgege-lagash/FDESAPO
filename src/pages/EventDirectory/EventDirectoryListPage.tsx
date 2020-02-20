import React from 'react';

import { Button, Card, Col, Modal, Row } from 'antd';
import { DatePicker, notification } from 'antd';
import { get } from 'lodash';
import moment, { Moment } from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as eventActions } from 'src/actions/event-directory.action';
import { EventDirectoryList } from 'src/components/EventDirectoryList/EventDirectoryList';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import {
  getDenormalizedEventDirectories,
  getFormatedEvents,
} from 'src/selectors/event-directory.selector';
import { getMallById } from 'src/selectors/mall.selector';
import { FormatedEvent } from 'src/types/response/EventDirectory';
import { createMallDependentUrl } from 'src/utils';
import { dateFormat } from 'src/utils/event-directory.utils';

const { RangePicker } = DatePicker;

interface StateProps {
  events: FormatedEvent[];
  mallId: number;
  total: number;
}

interface DispatchProps {
  actions: {
    fetchEventDirectoryList: typeof eventActions.fetchPagedEntityList;
    deleteEventDirectory: typeof eventActions.deleteEntity;
  };
}
interface QueryObject {
  name?: any;
  fromDate?: any;
  toDate?: any;
  orderBy?: any;
}

interface OwnState {
  page?: number;
  limit?: number;
  queryData: QueryObject;
  query?: { filter: any; sort: any };
  fromDate?: Moment;
  toDate?: Moment;
}

type Props = StateProps & DispatchProps;

class EventDirectoryListPage extends React.PureComponent<Props, OwnState> {
  public state = {
    page: 1,
    limit: 10,
    queryData: {},
    query: undefined,
    fromDate: undefined,
    toDate: undefined,
  };

  public componentDidMount() {
    const { actions: dispatchActions, mallId } = this.props;
    dispatchActions.fetchEventDirectoryList(mallId, 1, 10);
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, actions: dispatchActions } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchEventDirectoryList(mallId, 1, 10);
    }
  }

  public handleChange = (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => {
    const { mallId, actions: dispatchActions } = this.props;
    const { fromDate, toDate } = this.state;
    const queryData = this.createQueryObject(query, fromDate, toDate);
    this.setState({ page, limit, queryData, query });
    dispatchActions.fetchEventDirectoryList(
      mallId,
      page || 1,
      limit || 10,
      queryData
    );
  };

  public createQueryObject = (
    query?: { filter: any; sort: any },
    fromDate?: Moment,
    toDate?: Moment
  ) => {
    if (query) {
      const { filter, sort } = query;
      return {
        ...(filter.name && { name: filter.name }),
        ...(filter.states && { states: JSON.stringify(filter.states) }),
        ...(fromDate && { fromDate: fromDate.format(dateFormat) }),
        ...(toDate && {
          toDate: toDate.format(dateFormat),
        }), // one dayy added to include the last day
        ...(sort &&
          sort.field && {
            orderBy: `${sort.field} ${
              sort.order === 'ascend' ? 'ASC' : 'DESC'
            }`,
          }),
      };
    }
    const { fromDate: fd, toDate: td, ...newQuery } = this.state
      .queryData as QueryObject;

    return {
      ...newQuery,
      ...(fromDate && { fromDate: fromDate.format(dateFormat) }),
      ...(toDate && { toDate: toDate.format(dateFormat) }),
    };
  };

  public onChangeDate = (dates: [Moment, Moment]): void => {
    const { mallId, actions: dispatchActions } = this.props;
    const { query, limit } = this.state;
    const page = 1;
    const [fromDate, toDate] = dates;

    const queryData = this.createQueryObject(query, fromDate, toDate);
    this.setState({
      page,
      queryData,
      query,
      fromDate,
      toDate,
    });

    dispatchActions.fetchEventDirectoryList(mallId, page, limit, queryData);
  };

  public confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Eliminar Evento',
      content:
        '¿Está seguro que desea eliminar este evento? \n Si elimina este evento también será eliminada de las tiendas relacionadas, esta operación es irreversible.',
      okText: 'Si estoy seguro',
      cancelText: 'No',
      onOk: () => this.handleDelete(id),
    });
  };

  public handleDelete = (id: number) => {
    const { mallId, actions } = this.props;
    actions.deleteEventDirectory(mallId, id);
    notification.success({
      message: 'Evento eliminado',
      description: 'Evento eliminado correctamente',
    });
  };

  public render() {
    const data = this.props.events || [];
    const { total } = this.props;
    const baseUrl = createMallDependentUrl(this.props.mallId, '');
    return (
      <PageHeaderWrapper title={'Lista de Eventos'}>
        <Card>
          <PermissionCheck permission={[AppPermissions.event.create]}>
            <div className="table-list-operator-row">
              <Link to={`${baseUrl}/events/create`}>
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>
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
              {/* <Col className="gutter-row" span={12} style={{textAlign: 'right'}}>
                <Button>Limpiar Filtro</Button>
              </Col> */}
            </Row>
          </div>

          <EventDirectoryList
            baseUrl={baseUrl}
            events={data}
            deleteElement={this.confirmDelete}
            onChange={this.handleChange}
            total={total}
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
        fetchEventDirectoryList: eventActions.fetchPagedEntityList,
        deleteEventDirectory: eventActions.deleteEntity,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const page = state.events.page;
  const ids = get(state.events, `pages[${page}]`, []);
  const mall = getMallById(state, mallId || 0);
  const { timezone } = mall;
  const denorm = getDenormalizedEventDirectories(state, ids);
  const today = moment()
    .tz(timezone)
    .startOf('day');
  return {
    mallId,
    total: state.events.total,
    events: getFormatedEvents(denorm, today),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EventDirectoryListPage);
