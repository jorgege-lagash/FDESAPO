import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { actions } from 'src/actions/zone.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import ZoneForm from 'src/components/ZoneForm/ZoneForm';
import { ApplicationState } from 'src/reducers';
import { Zone } from 'src/types/response/Zone';
import { createMallDependentUrl } from 'src/utils';

interface StateProps {
  error?: any;
  isLoading: boolean;
  mallId: number;
  saved: boolean;
}

interface DispatchProps {
  actions: {
    createZone: typeof actions.createZone;
  };
}

type Props = StateProps & DispatchProps;

class CreateZonePage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };

  public componentDidUpdate(prevProps: Props) {
    const { saved, isLoading, error } = this.props;
    if (prevProps.isLoading && isLoading === false) {
      if (!prevProps.saved && saved) {
        this.handleZoneSuccess();
      }
      if (!prevProps.error && error) {
        this.handleZoneFailure();
      }
    }
  }

  public handleSubmit = (zoneData: Zone) => {
    this.props.actions.createZone(this.props.mallId, zoneData);
  };

  public handleZoneFailure = () => {
    notification.error({
      message: 'Error',
      description: 'Hubo un error al momento de crear la zona.',
    });
  };

  public handleZoneSuccess = () => {
    notification.success({
      message: 'Zona creada',
      description: 'Zona creada correctamente',
    });
    this.setState({
      redirect: true,
    });
  };

  public render() {
    const { isLoading, mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Crear Zona'}>
        <Card>
          {this.state.redirect && <Redirect to={`${baseUrl}/zones/list`} />}
          <Spin spinning={isLoading}>
            <ZoneForm onSubmit={this.handleSubmit} />
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    mallId: state.malls.selectedMall || 0,
    saved: state.zones.saved,
    error: state.zones.error,
    isLoading: state.zones.isLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { createZone } = actions;
  return {
    actions: bindActionCreators({ createZone }, dispatch),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreateZonePage);
export default connectedComponent;
