import React from 'react';

import { notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { difference } from 'lodash';
import { actions as poiActions } from 'src/actions/poi.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import ControlledPoiForm from 'src/components/PoiForm/ControlledPoiForm';
import { ApplicationState } from 'src/reducers';
import { getPoiById } from 'src/selectors/poi.selector';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Poi, PoiFormData } from 'src/types/response/POI';
import { Tag } from 'src/types/response/Tag';
import { PoiTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl, parseObjectListIds } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';
interface StateProps {
  currentLang: string;
  isLoading: boolean;
  poi: Poi | null;
  mallId: number;
  poiId: number;
  isLoadingPwPois: boolean;
}

interface DispatchProps {
  actions: {
    updatePoi: typeof poiActions.updatePoi;
  };
}

interface TagsParams {
  ids: number[];
  newTags: Tag[];
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }, any, { returnUrl: string }> &
  InjectedIntlProps;

class EditPoiPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialPoi: {},
  };

  public handleSubmit = (
    poi: PoiFormData,
    translations: TypedLooseObject<PoiTranslationFormProps>,
    newTags: Tag[]
  ) => {
    const { mallId, poiId } = this.props;
    const diffIds = difference(poi.tags, parseObjectListIds(newTags));
    const tags: TagsParams = { ids: diffIds, newTags };
    const data = Object.keys(poi).reduce(
      (acc, key) => {
        if (poi[key] !== undefined && this.state.initialPoi[key] !== poi[key]) {
          acc[key] = poi[key];
        }
        return acc;
      },
      {} as Partial<Poi>
    );
    this.props.actions.updatePoi(mallId, poiId, data, tags, translations);
  };

  public handlePoiFailure = (error: any) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de actualizar el poi.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'store.label'
    );
    notification.error({
      message: 'Error',
      description: content,
    });
  };

  public handlePoiSuccess = () => {
    notification.success({
      message: 'POI actualizado',
      description: 'POI actualizado correctamente',
    });
    this.setState({
      redirect: true,
    });
  };

  public render() {
    const { isLoading, mallId, poiId, location } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl =
      (location.state && location.state.returnUrl) || `${baseUrl}/pois/list`;
    return (
      <PageHeaderWrapper title={'Editar POI'}>
        {this.state.redirect && <Redirect to={returnUrl} />}
        <Spin spinning={isLoading}>
          <ControlledPoiForm
            poiId={poiId}
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

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const { match } = props;
  const poiId = Number(match.params.id);
  const mallId = Number(state.malls.selectedMall) || 0;
  const currentLang = state.locale.lang;
  return {
    mallId,
    poiId: Number(poiId),
    isLoading: state.pois.isLoading,
    poi: getPoiById(state, poiId),
    isLoadingPwPois: state.pwpois.isLoading,
    currentLang,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updatePoi } = poiActions;
  return {
    actions: bindActionCreators(
      {
        updatePoi,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditPoiPage);

export default withRouter(injectIntl(connectedComponent, { withRef: true }));
