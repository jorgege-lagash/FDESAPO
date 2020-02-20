import { Tag } from 'antd';
import React from 'react';
import { PoiState, PoiStateValues } from 'src/types/response/PoiState';

interface Props {
  poiState?: PoiState;
}

const PoiStateTag: React.SFC<Props> = (props: Props) => {
  let responseTag;
  if (props.poiState === undefined) {
    return null;
  }
  switch (props.poiState.id) {
    case PoiStateValues.comingSoon:
      responseTag = <Tag color="#45973d">{props.poiState.name}</Tag>;
      break;
    case PoiStateValues.inMakeover:
      responseTag = <Tag color="#e52b26">{props.poiState.name}</Tag>;
      break;
    default:
      responseTag = <Tag>{props.poiState.name}</Tag>;
  }
  return responseTag;
};

export default PoiStateTag;
