import React from 'react';

import { Divider, Icon, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FormatedDeal } from 'src/types/response/Deal';
import {
  EventDirectoryState,
  stateTags,
} from 'src/utils/event-directory.utils';
import { compareFilterStrings, createFilter } from 'src/utils/table.utils';

interface DealListProps {
  returnUrl: string;
  baseUrl: string;
  deals: FormatedDeal[];
  deleteElement: (id: number) => void;
  total?: number;
  currentPage?: number;
  loading: boolean;
  onChange: (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => void;
}

const defaultProps = {
  baseUrl: '',
  returnUrl: '',
  loading: false,
  onChange: () => {
    return;
  },
  deleteElement: () => {
    return;
  },
};
export class DealList extends React.PureComponent<DealListProps> {
  public static defaultProps = defaultProps;
  public state = {
    searchText: '',
  };

  public getShortName = (value: string): string => {
    let result = '';
    if (value) {
      result = value.slice(0, 12);
      result = value.length > 12 ? `${result}...` : result;
    }
    return result;
  };

  public get columns(): Array<ColumnProps<FormatedDeal>> {
    const { baseUrl } = this.props;
    return [
      {
        title: 'Título',
        dataIndex: 'title',
        key: 'title',
        sorter: true,
        onFilter: (value, record) => compareFilterStrings(value, record.title),
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
        title: 'Poi',
        dataIndex: 'poi',
        key: 'poi',
        render: (poi) => (
          <span>{poi && poi.name ? this.getShortName(poi.name) : ''}</span>
        ),
      },
      {
        title: 'Inicio',
        dataIndex: 'displayStartDate',
        key: 'displayStartDate',
        sorter: true,
        render: (displayStartDate) => (
          <span>
            {moment(displayStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
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
            {moment(displayEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
          </span>
        ),
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`${baseUrl}/deals/${record.id}/edit`}>Editar</Link>
            <Divider type="vertical" />
            <Link to={`${baseUrl}/deals/${record.id}/detail`}>Detalle</Link>
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
    const { deals, total: count, loading, currentPage } = this.props;
    const total = count || deals.length;
    return (
      <Table
        loading={loading}
        columns={this.columns}
        dataSource={deals}
        rowKey="id"
        onChange={this.handleChange}
        pagination={{
          total,
          current: currentPage,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '30'],
        }}
      />
    );
  }

  public handleChange = (
    pagination: PaginationConfig,
    filters: Record<'title', string[]>,
    sorter: SorterResult<FormatedDeal>
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
}
