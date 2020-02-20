import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import { actions } from 'src/actions/zone.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import { ZoneList } from 'src/components/ZoneList/ZoneList';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getZonesByMallId } from 'src/selectors/zone.selector';
import { Zone } from 'src/types/response/Zone';
import { createMallDependentUrl } from 'src/utils';

interface StateProps {
  zones: Zone[];
  mallId: number;
}

interface DispatchProps {
  actions: {
    fetchZoneList: typeof actions.fetchZoneList;
  };
}

type Props = StateProps & DispatchProps;

class ZoneListPage extends React.PureComponent<Props> {
  public componentDidMount() {
    const { actions: dispatchActions, mallId } = this.props;
    dispatchActions.fetchZoneList(mallId);
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, actions: dispatchActions } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchZoneList(mallId);
    }
  }

  public render() {
    const data: Zone[] = this.props.zones || [];
    const baseUrl = createMallDependentUrl(this.props.mallId, '');
    return (
      <PageHeaderWrapper title={'Lista de Zonas'}>
        <Card>
          <PermissionCheck permission={[AppPermissions.zone.create]}>
            <div className="table-list-operator-row">
              <Link to={`${baseUrl}/zones/create`}>
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>

          <ZoneList baseUrl={baseUrl} zones={data} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { fetchZoneList } = actions;
  return {
    actions: bindActionCreators(
      {
        fetchZoneList,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  return {
    mallId,
    zones: getZonesByMallId(state, mallId || 0),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(ZoneListPage);
