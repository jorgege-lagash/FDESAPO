import React from 'react';

import { Divider, Icon, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import StateTag from 'src/components/StateTag/StateTag';
import * as AppPermissions from 'src/constants/permissions';
import { PermissionContext } from 'src/layouts/PermissionContext';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { hasPermission } from 'src/utils';
import { compareFilterStrings, createFilter } from 'src/utils/table.utils';

interface FeaturedSpaceListProps {
  baseUrl: string;
  data: FeaturedSpace[];
  total: number;
  deleteElement: (id: number) => void;
  onChange: (
    page?: number,
    pageZise?: number,
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

export class FeaturedSpaceList extends React.PureComponent<
  FeaturedSpaceListProps
> {
  public static defaultProps = defaultProps;
  public state = {
    searchText: '',
  };

  public handleChange = (
    pagination: PaginationConfig,
    filters: Record<'name', string[]>,
    sorter: SorterResult<FeaturedSpace>
  ) => {
    const { current: page, pageSize } = pagination;
    this.props.onChange(page, pageSize, { filter: filters, sort: sorter });
    return;
  };

  public get columns(): Array<ColumnProps<FeaturedSpace>> {
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
        dataIndex: 'active',
        key: 'active',
        render: (text, record) => <StateTag active={record.active} />,
      },
      {
        title: 'Tipo',
        dataIndex: 'featureSpaceType.name',
        key: 'featureSpaceType.id',
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <PermissionContext.Consumer>
            {(userPermission) => (
              <span>
                <Link to={`${baseUrl}/featured-space/${record.id}/edit`}>
                  Editar
                </Link>
                <Divider type="vertical" />
                <Link to={`${baseUrl}/featured-space/${record.id}/detail`}>
                  Detalle
                </Link>
                <Divider type="vertical" />
                {hasPermission(
                  [AppPermissions.featuredSpace.remove],
                  userPermission.permissions
                ) && (
                  <Icon
                    type="delete"
                    theme="twoTone"
                    twoToneColor="#eb2f96"
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => this.props.deleteElement(record.id)}
                  />
                )}
              </span>
            )}
          </PermissionContext.Consumer>
        ),
      },
    ];
  }

  public render() {
    const { data, total } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={data}
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
