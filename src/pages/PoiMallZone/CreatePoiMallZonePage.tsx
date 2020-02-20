import React from 'react';

import { Card, notification } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions as poiMallZoneActions } from 'src/actions/poi-mall-zone.action';
// import ControlledPoiMallZoneForm from 'src/components/PoiMallZoneForm/ControlledPoiMallZoneForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { PoiMallZone } from 'src/types/response/PoiMallZone';
import { PoiMallZoneTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  error?: any;
  isLoading: boolean;
  mallId: number;
  saved: boolean;
}

interface DispatchProps {
  actions: {
    createPoiMallZone: typeof poiMallZoneActions.createEntity;
  };
}

type Props = StateProps & DispatchProps & InjectedIntlProps;

class CreatePoiMallZonePage extends React.PureComponent<Props> {
  // public state = {
  //   redirect: false,
  // };

  // public handleSubmit = (
  //   data: PoiMallZone,
  //   translations: TypedLooseObject<PoiMallZoneTranslationFormProps>
  // ) => {
  //   this.props.actions.createPoiMallZone(this.props.mallId, data, translations);
  // };

  // public handleSuccess = () => {
  //   this.setState({
  //     redirect: true,
  //   });
  //   notification.success({
  //     message: 'Zona Horaria creada',
  //     description: 'Zona Horaria creada correctamente',
  //   });
  // };

  // public handleFailure = (error: ApiError) => {
  //   const { intl } = this.props;
  //   const defaultMessage = 'Hubo un error al momento de crear la zona horaria.';
  //   const content = buildErrorMessageContent(
  //     defaultMessage,
  //     error,
  //     intl,
  //     'poiMallZone.label'
  //   );
  //   notification.error({
  //     message: 'Error',
  //     description: content,
  //   });
  // };

  public render() {
    // const { mallId } = this.props;
    // const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Crear Zona Horaria'}>
        <Card>
          {/* {this.state.redirect && (
            <Redirect to={`${baseUrl}/poiMallZones/list`} />
          )} */}
          {/* <ControlledPoiMallZoneForm
            mallId={mallId}
            onSubmit={this.handleSubmit}
            onSuccess={this.handleSuccess}
            onFailure={this.handleFailure}
          /> */}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

// export const mapStateToProps = (state: ApplicationState): StateProps => {
//   const mallId = state.malls.selectedMall || 0;
//   return {
//     mallId,
//     saved: state.poiMallZones.saved,
//     error: state.poiMallZones.error,
//     isLoading: state.poiMallZones.isLoading,
//   };
// };

// const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
//   return {
//     actions: bindActionCreators(
//       {
//         createPoiMallZone: poiMallZoneActions.createEntity,
//       },
//       dispatch
//     ),
//   };
// };

// const connectedComponent = connect<StateProps, DispatchProps>(
//   // mapStateToProps,
//   // mapDispatchToProps
// )(CreatePoiMallZonePage);
// export default injectIntl(connectedComponent, { withRef: true });
export default CreatePoiMallZonePage;
