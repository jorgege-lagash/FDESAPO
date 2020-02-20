import React from 'react';

import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { Zone } from 'src/types/response/Zone';
import { createFilter } from 'src/utils/table.utils';

interface ZoneListProps {
  baseUrl: string;
  zones: Zone[];
}

const defaultProps = {
  baseUrl: '',
};
export class ZoneList extends React.PureComponent<ZoneListProps> {
  public static defaultProps = defaultProps;
  public state = {
    searchText: '',
  };
  public get columns(): Array<ColumnProps<Zone>> {
    const { baseUrl } = this.props;
    return [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.name.localeCompare(b.name),
        onFilter: (value, record) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
        ...createFilter(),
      },
      {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description',
        sorter: (a, b) => a.description.localeCompare(b.description),
        onFilter: (value, record) =>
          record.description.toLowerCase().includes(value.toLowerCase()),
        ...createFilter(),
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`${baseUrl}/zones/${record.id}/edit`}>Editar</Link>
          </span>
        ),
      },
    ];
  }

  public render() {
    const zones = this.props.zones;
    const total = zones.length;
    return (
      <Table
        columns={this.columns}
        dataSource={zones}
        rowKey="id"
        pagination={{
          total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '30'],
        }}
      />
    );
  }
}
