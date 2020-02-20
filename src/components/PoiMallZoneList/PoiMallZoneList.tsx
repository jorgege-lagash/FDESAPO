import React from 'react';

import { Divider, Icon, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { PoiMallZone } from 'src/types/response/PoiMallZone';
import {
  compareFilterStrings,
  compareSortStrings,
  createFilter,
} from 'src/utils/table.utils';

interface PoiMallZoneListProps {
  baseUrl: string;
  poiMallZones: PoiMallZone[];
  deleteElement: (id: number) => void;
}

const defaultProps = {
  baseUrl: '',
  deleteElement: () => {
    return;
  },
};
export class PoiMallZoneList extends React.PureComponent<PoiMallZoneListProps> {
  public static defaultProps = defaultProps;
  public state = {
    searchText: '',
  };
  public get columns(): Array<ColumnProps<PoiMallZone>> {
    const { baseUrl } = this.props;
    return [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => compareSortStrings(a.name, b.name),
        onFilter: (value, record) => compareFilterStrings(value, record.name),
        ...createFilter(),
      },
      {
        title: 'Accionessss',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`${baseUrl}/categories/${record.id}/edit`}>Editar</Link>
            <Divider type="vertical" />
            <Link to={`${baseUrl}/categories/${record.id}/detail`}>
              Detalle
            </Link>
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
    const categories = this.props.poiMallZones;
    const total = categories.length;
    return (
      <Table
        columns={this.columns}
        dataSource={categories}
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
