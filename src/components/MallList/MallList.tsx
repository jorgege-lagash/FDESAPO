import React from 'react';

import { Divider, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { createFilter } from 'src/utils/table.utils';
import { Mall } from '../../types/Mall';

interface MallListProps {
  malls: Mall[];
}
export class MallList extends React.PureComponent<MallListProps> {
  public state = {
    searchText: '',
  };
  public get columns(): Array<ColumnProps<Mall>> {
    return [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        onFilter: (value, record) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
        ...createFilter(),
      },
      {
        title: 'Código',
        dataIndex: 'stringId',
        key: 'stringId',
        sorter: (a, b) => a.stringId.localeCompare(b.stringId),
        onFilter: (value, record) =>
          record.stringId.toLowerCase().includes(value.toLowerCase()),
        ...createFilter(),
      },
      {
        title: 'Id de edificio',
        dataIndex: 'buildingId',
        key: 'buildingId',
        sorter: (a, b) => a.buildingId - b.buildingId,
      },
      {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Acciones',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`/cms/malls/${record.id}/terms`}>Terminos</Link>
            <Divider type="vertical" />
            <Link to={`/cms/malls/${record.id}/detail`}>Detalle</Link>
            <Divider type="vertical" />
            <Link to={`/cms/malls/${record.id}/update`}>Editar</Link>
          </span>
        ),
      },
    ];
  }

  public render() {
    const malls = this.props.malls;
    const total = malls.length;
    return (
      <Table
        columns={this.columns}
        dataSource={malls}
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
