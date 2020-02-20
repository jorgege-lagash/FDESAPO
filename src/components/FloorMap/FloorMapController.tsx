import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as maasActions } from 'src/actions/maas.action';
import { ApplicationState } from 'src/reducers';
import { getMallById } from 'src/selectors/mall.selector';
import { getDenormalizedPwBuildings } from 'src/selectors/pwbuilding.selector';
import { getPwFloorById } from 'src/selectors/pwfloor.selector';
import { getPwPoiById, getPwPoisByFloorId } from 'src/selectors/pwpoi.selector';
import { PwBuilding, PwFloor } from 'src/types/response/PwBuilding';
import { PwPoi } from 'src/types/response/PwPoi';
import {
  domToImageDownload,
  elementToBase64Image,
} from 'src/utils/image.utils';
import { FloorMap } from './FloorMap';

interface OwnProps {
  floorId: number;
  poiId?: number;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
}

interface StateProps {
  building: PwBuilding | null;
  floor: PwFloor | null;
  pois: PwPoi[];
  buildingId: number;
  mallId: number;
}

interface DispatchProps {
  actions: {
    fetchPwBuilding: typeof maasActions.fetchPwBuilding;
  };
}

interface OwnState {
  zoomLevel: number;
}
const defaultProps = {
  floorId: 0,
  onChange: () => {
    return;
  },
};

type Props = OwnProps & StateProps & DispatchProps;
export class FloorMapController extends React.Component<Props, OwnState> {
  public static defaultProps = defaultProps;

  public state = {
    zoomLevel: 18,
  };

  public mapRef = React.createRef<FloorMap>();

  constructor(props: any) {
    super(props);
  }
  public componentDidMount() {
    const { building, mallId, actions } = this.props;
    if (mallId && !building) {
      actions.fetchPwBuilding(mallId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, actions } = this.props;
    if (mallId !== prevProps.mallId) {
      actions.fetchPwBuilding(mallId);
    }
  }

  public get leafletElement() {
    return this.mapRef.current!.leafletElement;
  }

  public download = () => {
    const filename = 'map-image';
    const mapComponent = this.mapRef.current;
    if (mapComponent && mapComponent.currentMap) {
      domToImageDownload(this.mapRef.current!.containerElement, filename);
    }
  };

  public getBase64Image = () =>
    elementToBase64Image(this.mapRef.current!.containerElement);

  public render() {
    const { floor, pois, style } = this.props;
    return (
      <FloorMap ref={this.mapRef} style={style} floor={floor} pois={pois} />
    );
  }
}

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const { floorId, poiId } = props;
  const mallId = state.malls.selectedMall || 0;
  const mall = getMallById(state, mallId);
  const buildingId = mall ? mall.buildingId : 0;
  const building = getDenormalizedPwBuildings(state, [buildingId])[0];
  let floor = getPwFloorById(state, floorId);
  if (building && !floorId) {
    floor = building.floors[0];
  }
  let pois: PwPoi[] = [];
  if (poiId) {
    const selectedPoi = getPwPoiById(state, poiId);
    pois = selectedPoi ? [selectedPoi] : [];
    if (!floorId && selectedPoi) {
      floor = getPwFloorById(state, selectedPoi.floorId);
    }
  } else if (floor) {
    pois = getPwPoisByFloorId(state, floor.id) || [];
  }

  return {
    mallId,
    buildingId,
    building,
    floor,
    pois,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchPwBuilding } = maasActions;
  return {
    actions: bindActionCreators({ fetchPwBuilding }, dispatch),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    withRef: true,
  }
)(FloorMapController);
