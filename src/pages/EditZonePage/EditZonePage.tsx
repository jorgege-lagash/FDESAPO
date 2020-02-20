import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import ZoneForm from 'src/components/ZoneForm/ZoneForm';
import { createMallDependentUrl } from 'src/utils';
import { actions } from '../../actions/zone.action';
import { ApplicationState } from '../../reducers';
import { getZoneById } from '../../selectors/zone.selector';
import { Zone } from '../../types/response/Zone';

interface StateProps {
  error?: any;
  isLoading: boolean;
  zone: Zone;
  mallId: number;
  zoneId: number;
  saved: boolean;
}

interface DispatchProps {
  actions: {
    updateZone: typeof actions.updateZone;
    fetchZone: typeof actions.fetchZone;
  };
}

type Props = StateProps & DispatchProps & RouteComponentProps<{ id: string }>;

class EditZonePage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialZone: {},
  };

  public componentDidUpdate(prevProps: Props) {
    const { error, saved, mallId, zone, zoneId } = this.props;
    if (!prevProps.saved && saved) {
      this.handleZoneSuccess();
    }
    if (!prevProps.error && error) {
      this.handleZoneFailure();
    }
    if (!prevProps.mallId && mallId && !zone) {
      this.props.actions.fetchZone(mallId, zoneId);
    }
  }
  public componentDidMount() {
    const { zone, mallId, zoneId } = this.props;
    if (mallId && !zone) {
      this.props.actions.fetchZone(mallId, zoneId);
    }
  }

  public handleSubmit = (zone: Zone) => {
    const { mallId, zoneId } = this.props;
    const data = Object.keys(zone).reduce(
      (acc, key) => {
        if (zone[key] && this.state.initialZone[key] !== zone[key]) {
          acc[key] = zone[key];
        }
        return acc;
      },
      {} as Partial<Zone>
    );
    this.props.actions.updateZone(mallId, zoneId, data);
  };

  public handleZoneFailure = () => {
    notification.error({
      message: 'Error',
      description:
        'Hubo un error al momento de actualizar la zona. asegurese de que no exista otra con el mismo nombre.',
    });
  };

  public handleZoneSuccess = () => {
    notification.success({
      message: 'Zona actualizada',
      description: 'Zona actualizada correctamente',
    });
    this.setState({
      redirect: true,
    });
  };

  public render() {
    const { isLoading, zone, mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Editar Zona'}>
        <Card>
          {this.state.redirect && <Redirect to={`${baseUrl}/zones/list`} />}
          <Spin spinning={isLoading}>
            <ZoneForm defaultData={zone} onSubmit={this.handleSubmit} />
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const { match } = props;
  const zoneId = match.params.id;
  return {
    saved: state.zones.saved,
    zoneId: Number(zoneId),
    error: state.zones.error,
    isLoading: state.zones.isLoading,
    zone: getZoneById(state, zoneId),
    mallId: state.malls.selectedMall || 0,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updateZone, fetchZone } = actions;
  return {
    actions: bindActionCreators(
      {
        updateZone,
        fetchZone,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditZonePage);

export default withRouter(connectedComponent);
