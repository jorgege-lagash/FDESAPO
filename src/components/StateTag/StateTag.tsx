import { Tag } from 'antd';
import React from 'react';

interface Props {
  active: boolean;
}

const StateTag: React.SFC<Props> = (props: Props) => {
  return props.active ? <Tag color="green">Activo</Tag> : <Tag>Inactivo</Tag>;
};

export default StateTag;
