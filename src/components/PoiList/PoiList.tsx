import React from 'react';

import { Divider, Icon, Table, Tag } from 'antd';
import {
  ColumnFilterItem,
  ColumnProps,
  PaginationConfig,
  SorterResult,
} from 'antd/lib/table';
import { Link } from 'react-router-dom';
import PoiStateTag from 'src/components/PoiStateTag/PoiStateTag';
import { Category } from 'src/types/response/Category';
import { Poi } from 'src/types/response/POI';
import {
  compareFilterStrings,
  compareSortStrings,
  createFilter,
} from 'src/utils/table.utils';

interface Props {
  baseUrl: string;
  returnUrl: string;
  pois: Poi[];
  categories: Category[];
  total?: number;
  currentPage?: number;
  loading: boolean;
  onChange: (
    page?: number,
    limit?: number,
    query?: { filter: any; sort: any }
  ) => void;
  deleteElement: (poiId: number) => void;
}
const defaultProps = {
  baseUrl: '',
  returnUrl: '',
  loading: false,
  categories: [],
  onChange: () => {
    return;
  },
  deleteElement: () => {
    return;
  },
};

export class PoiList extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;
  public state = {
    searchText: '',
  };

  public get categoryFilterItems(): ColumnFilterItem[] {
    return this.props.categories
      .filter((c) => c)
      .map((c) => ({
        text: c.name,
        value: `${c.id}` || '',
      }));
  }

  public get columns(): Array<ColumnProps<Poi>> {
    const { baseUrl, returnUrl } = this.props;
    const canDeletePOIs = false;
    return [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => compareSortStrings(b.name, a.name),
        onFilter: (value = '', record) =>
          compareFilterStrings(value, record.name),
        ...createFilter(),
      },
      {
        title: 'Categorias',
        dataIndex: 'categories',
        render: (text, record, index) => {
          if (!record.categories) {
            return [];
          }
          return (
            <div>
              {record.categories
                .filter((c) => c)
                .map((c) => (
                  <Tag key={c.id} color="geekblue">
                    {c.name}
                  </Tag>
                ))}
            </div>
          );
        },
        key: 'categories',
        filters: this.categoryFilterItems,
        onFilter: (value, record) => {
          return record.categories.reduce((containsValue, category) => {
            if (containsValue) {
              return containsValue;
            }
            return `${category.id}` === `${value}`;
          }, false);
        },
      },
      {
        title: 'Estado',
        dataIndex: 'poiState',
        key: 'poiState',
        // sorter: (a, b) => (a.active === b.active ? 0 : -1),
        render: (poiState) => <PoiStateTag poiState={poiState} />,
      },
      {
        title: 'Logo',
        key: 'logo',
        render: (text, record) => (
          <span>
            <img src={record.logo ? record.logo.url : ''} width="64" />
          </span>
        ),
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link
              to={{
                pathname: `${baseUrl}/pois/${record.id}/detail`,
                state: { returnUrl },
              }}>
              Detalle
            </Link>
            <Divider type="vertical" />
            <Link
              to={{
                pathname: `${baseUrl}/pois/${record.id}/edit`,
                state: { returnUrl },
              }}>
              Editar
            </Link>
            <Divider type="vertical" />
            {canDeletePOIs && (
              <Icon
                type="delete"
                theme="twoTone"
                twoToneColor="#eb2f96"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.props.deleteElement(record.id)}
              />
            )}
          </span>
        ),
      },
    ];
  }

  public handleChange = (
    pagination: PaginationConfig,
    filters: Record<'name', string[]>,
    sorter: SorterResult<Poi>
  ) => {
    const { current: page, pageSize } = pagination;
    this.props.onChange(page, pageSize, { filter: filters, sort: sorter });
    return;
  };

  public render() {
    const { pois, total: count, loading, currentPage } = this.props;
    const total = count || pois.length;
    return (
      <Table
        loading={loading}
        columns={this.columns}
        dataSource={pois}
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
}
