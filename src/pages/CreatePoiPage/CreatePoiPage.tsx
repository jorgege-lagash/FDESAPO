import React from 'react';

import { notification, Spin } from 'antd';
import { difference } from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as poiActions } from 'src/actions/poi.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import ControlledPoiForm from 'src/components/PoiForm/ControlledPoiForm';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { PoiFormData } from 'src/types/response/POI';
import { Tag } from 'src/types/response/Tag';
import { PoiTranslationFormProps } from 'src/types/TranslationForm';
import { cleanTranslation, createMallDependentUrl } from 'src/utils';
import { parseObjectListIds } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  isLoading: boolean;
  mallId: number;
  isLoadingPwPois: boolean;
  currentLang: string;
}

interface DispatchProps {
  actions: {
    createPoi: typeof poiActions.createPoi;
  };
}

type Props = StateProps &
  DispatchProps &
  InjectedIntlProps &
  RouteComponentProps<any, any, { returnUrl: string }>;

interface TagsParams {
  ids: number[];
  newTags: Tag[];
}

class CreatePoiPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };

  public handleSubmit = (
    storeData: PoiFormData,
    translations: TypedLooseObject<PoiTranslationFormProps>,
    newTags: Tag[]
  ) => {
    const { currentLang } = this.props;
    const categories = storeData.categories as any;
    const diffIds = difference(storeData.tags, parseObjectListIds(newTags));
    const tags: TagsParams = { ids: diffIds, newTags };
    this.props.actions.createPoi(
      this.props.mallId,
      storeData,
      categories,
      tags,
      cleanTranslation(translations, currentLang)
    );
  };

  public handlePoiFailure = (error: any) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de crear el poi.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'store.label'
    );
    notification.error({
      message: 'Error',
      description: content,
      duration: 10,
    });
  };

  public handlePoiSuccess = () => {
    notification.success({
      message: 'POI creado',
      description: 'POI creado correctamente',
    });
    this.setState({
      redirect: true,
    });
  };

  public render() {
    const { isLoading, mallId, location } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl =
      (location.state && location.state.returnUrl) || `${baseUrl}/pois/list`;
    return (
      <PageHeaderWrapper title={'Crear POI'}>
        {this.state.redirect && <Redirect to={returnUrl} />}
        <Spin spinning={isLoading}>
          <ControlledPoiForm
            mallId={mallId}
            onSuccess={this.handlePoiSuccess}
            onFailure={this.handlePoiFailure}
            onSubmit={this.handleSubmit}
          />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (state: ApplicationState): StateProps => {
  const mallId = state.malls.selectedMall || 0;

  return {
    mallId,
    isLoading: state.pois.isLoading,
    isLoadingPwPois: state.pwpois.isLoading,
    currentLang: state.locale.lang,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        createPoi: poiActions.createPoi,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreatePoiPage);
export default withRouter(injectIntl(connectedComponent, { withRef: true }));
