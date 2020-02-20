import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Card, notification, Modal } from 'antd';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { actions as poiMallZoneActions } from 'src/actions/poi-mall-zone.action';
import { Link } from 'react-router-dom';
import { PoiMallZoneList } from 'src/components/PoiMallZoneList/PoiMallZoneList';
import { PoiMallZone } from 'src/types/response/PoiMallZone';

import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getPoiMallZonesByMallId } from 'src/selectors/poi-mall-zone.selector';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  poiMallZones: PoiMallZone[];
  mallId: number;
  error: any;
}

interface DispatchProps {
  actions: {
    fetchPoiMallZoneList: typeof poiMallZoneActions.fetchPagedEntityList;
    deletePoiMallZone: typeof poiMallZoneActions.deleteEntity;
  };
}

type Props = StateProps &
  DispatchProps &
  InjectedIntlProps &
  RouteComponentProps;
class PoiMallZoneListPage extends React.PureComponent<Props> {
  public componentDidMount() {
    const { actions: dispatchActions, mallId } = this.props;
    dispatchActions.fetchPoiMallZoneList(mallId, 1, 1000);
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, actions: dispatchActions, error, intl } = this.props;
    if (mallId !== prevProps.mallId) {
      dispatchActions.fetchPoiMallZoneList(mallId, 1, 1000);
    }

    if (error && error !== prevProps.error) {
      const content = buildErrorMessageContent(
        'Algo salio mal',
        error,
        intl,
        'poi-mall-zone.label'
      );
      notification.warn({
        message: 'Advertencia',
        description: content,
        duration: 8,
      });
    }
  }

  public confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Eliminar Zona Horaria',
      content:
        'Esta seguro que desea eliminar esta Zona Horaria?\n si elimina esta zona horaria tambien sera eliminada de las tiendas relacionadas, esta operacion es irreversible',
      okText: 'Si estoy seguro',
      cancelText: 'No',
      onOk: () => this.handleDelete(id),
    });
  };

  public handleDelete = (id: number) => {
    const { mallId, actions } = this.props;
    actions.deletePoiMallZone(mallId, id);
  };
  public render() {
    const data: PoiMallZone[] = this.props.poiMallZones || [];
    const baseUrl = createMallDependentUrl(this.props.mallId, '');
    return (
      <PageHeaderWrapper title={'Zona Horaria Poi'}>
        <Card>
          <PermissionCheck permission={[AppPermissions.poiMallZone.create]}>
            <div className="table-list-operator-row">
              <Link to={`${baseUrl}/poiMallZones/create`}>
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>
          <PoiMallZoneList poiMallZones={data} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchPoiMallZoneList: poiMallZoneActions.fetchPagedEntityList,
        deletePoiMallZone: poiMallZoneActions.deleteEntity,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const error = state.poiMallZones.error;
  return {
    mallId,
    poiMallZones: getPoiMallZonesByMallId(state, mallId || 0),
    error,
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(PoiMallZoneListPage);

export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
