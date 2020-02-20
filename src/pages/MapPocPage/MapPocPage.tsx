import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as maasActions } from 'src/actions/maas.action';

import { ApplicationState } from 'src/reducers';
import { getGlobalPwPoiList } from 'src/selectors/pwpoi.selector';
import { PwPoi } from 'src/types/response/PwPoi';
import { MapImageGenerator } from './MapImageGenerator';

interface StateProps {
  mallId: number;
  pois: PwPoi[];
}

interface DispatchProps {
  actions: {
    fetchPwPoiList: typeof maasActions.fetchPwPoiList;
  };
}

type Props = StateProps & DispatchProps;

class MapPocPage extends React.PureComponent<Props> {
  public mapControllerRef = React.createRef<any>();

  public state = {
    visible: false,
    confirmLoading: false,
    image: '',
    id: 0,
  };
  public componentDidMount() {
    const { mallId, actions } = this.props;
    actions.fetchPwPoiList(mallId);
  }

  public render() {
    const { pois } = this.props;
    return <MapImageGenerator defaultImage={''} pois={pois} />;
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(
      {
        fetchPwPoiList: maasActions.fetchPwPoiList,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const pois = getGlobalPwPoiList(state);
  return {
    mallId,
    pois,
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(MapPocPage);
