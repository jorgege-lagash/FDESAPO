import { Divider, Icon, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormatedEvent } from 'src/types/response/EventDirectory';
import {
  EventDirectoryState,
  stateTags,
} from 'src/utils/event-directory.utils';
import { compareFilterStrings, createFilter } from 'src/utils/table.utils';

const apiDateFormat = 'YYYY-MM-DD';

interface EventDirectoryListProps {
  baseUrl: string;
  events: FormatedEvent[];
  total: number;
  deleteElement: (id: number) => void;
  onChange: (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => void;
}

const defaultProps = {
  baseUrl: '',
  deleteElement: () => {
    return;
  },
  onChange: () => {
    return;
  },
};
export class EventDirectoryList extends React.PureComponent<
  EventDirectoryListProps
> {
  public static defaultProps = defaultProps;
  public state = {
    searchText: '',
    fromDate: null,
    toDate: null,
    today: moment().format(apiDateFormat),
  };

  public handleChange = (
    pagination: PaginationConfig,
    filters: Record<'name', string[]>,
    sorter: SorterResult<FormatedEvent>
  ) => {
    const newFilters = this.transformFilter(filters);
    const { current: page, pageSize } = pagination;
    this.props.onChange(page, pageSize, { filter: newFilters, sort: sorter });
    return;
  };

  public transformFilter = (filters: any) => {
    if (filters && filters.state && filters.state.length < 3) {
      const newState = filters.state;
      filters.states = newState;
    } else {
      delete filters.state;
    }
    return filters;
  };

  public get columns(): Array<ColumnProps<FormatedEvent>> {
    const { baseUrl } = this.props;
    return [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onFilter: (value, record) => compareFilterStrings(value, record.name),
        ...createFilter(),
      },
      {
        title: 'Estado',
        dataIndex: 'state',
        key: 'state',
        filters: [
          { text: 'Programado', value: EventDirectoryState.scheduled },
          { text: 'Publicado', value: EventDirectoryState.published },
          { text: 'Expirado', value: EventDirectoryState.expired },
        ],
        render: (state) => <span>{stateTags[state] || ''}</span>,
      },
      {
        title: 'Inicio',
        dataIndex: 'displayStartDate',
        key: 'displayStartDate',
        sorter: true,
        render: (displayStartDate) => (
          <span>
            {moment(displayStartDate, apiDateFormat).format('DD-MM-YYYY')}
          </span>
        ),
      },
      {
        title: 'Fin',
        dataIndex: 'displayEndDate',
        key: 'displayEndDate',
        sorter: true,
        render: (displayEndDate) => (
          <span>
            {moment(displayEndDate, apiDateFormat).format('DD-MM-YYYY')}
          </span>
        ),
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`${baseUrl}/events/${record.id}/edit`}>Editar</Link>
            <Divider type="vertical" />
            <Link to={`${baseUrl}/events/${record.id}/detail`}>Detalle</Link>
            <Divider type="vertical" />
            <Icon
              type="delete"
              theme="twoTone"
              twoToneColor="#eb2f96"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => this.props.deleteElement(record.id)}
            />
          </span>
        ),
      },
    ];
  }

  public render() {
    const { events, total } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={events}
        rowKey="id"
        onChange={this.handleChange}
        pagination={{
          total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '30'],
        }}
      />
    );
  }
}
