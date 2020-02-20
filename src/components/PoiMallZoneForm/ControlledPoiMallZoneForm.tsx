import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as poiMallZoneActions } from 'src/actions/poi-mall-zone.action';
import { actions as mallActions } from 'src/actions/mall.action';
// import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import PoiMallZoneForm from 'src/components/PoiMallZoneForm/PoiMallZoneForm';
import { ApplicationState } from 'src/reducers';
import { getPoiMallZonesByMallId } from 'src/selectors/poi-mall-zone.selector';
import {
  getPoiMallZoneById,
  getTranslatedPoiMallZoneById,
} from 'src/selectors/poi-mall-zone.selector';
// import { getPoiTypeList } from 'src/selectors/poi-type.selector';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { PoiMallZone } from 'src/types/response/PoiMallZone';
// import { PoiType } from 'src/types/response/PoiType';
import { PoiMallZoneTranslationFormProps } from 'src/types/TranslationForm';

interface StateProps {
  error?: any;
  isLoading: boolean;
  poiMallZone: PoiMallZone | null;
  currentLang: string;
  saved: boolean;
  poiMallZones: PoiMallZone[];
  // poiTypes: PoiType[];
  translations: TypedLooseObject<PoiMallZone>;
}

interface DispatchProps {
  actions: {
    fetchPoiMallZone: typeof poiMallZoneActions.fetchEntity;
    // fetchPoiTypeList: typeof poiTypeActions.fetchEntityList;
    selectMall: typeof mallActions.selectMall;
  };
}
interface OwnProps {
  mallId: number;
  poiMallZoneId?: number;
  onSuccess: () => void;
  onFailure: (error: any) => void;
  onSubmit: (
    poiMallZone: PoiMallZone,
    translations: TypedLooseObject<PoiMallZoneTranslationFormProps>
  ) => void;
}
const defaultProps = {
  onSuccess: () => undefined,
  onFailure: () => undefined,
};

type Props = OwnProps & StateProps & DispatchProps;

class ControlledPoiMallZoneForm extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;
  public state = {
    initialPoiMallZone: {},
  };

  // public componentDidMount() {
  //   const { mallId, actions, poiMallZone } = this.props;

  //   // this.fetchFormData();
  //   // actions.fetchPoiTypeList(mallId);
  //   // if (poiMallZone && mallId !== poiMallZone.mallId) {
  //   //   actions.selectMall(poiMallZone.mallId);
  //   // }
  // }

  public componentDidUpdate(prevProps: Props) {
    const {
      error,
      saved,
      mallId,
      poiMallZoneId,
      poiMallZone,
      actions,
    } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }
    if (!prevProps.error && error) {
      this.handleFailure();
    }

    if (prevProps.mallId !== mallId) {
      this.fetchFormData();
      // this.fetchMallData();
    }
    if (prevProps.poiMallZoneId !== poiMallZoneId) {
      this.fetchFormData();
    }
    if (poiMallZone && mallId !== poiMallZone.mallId) {
      actions.selectMall(poiMallZone.mallId);
      // actions.fetchPoiTypeList(mallId);
    }
  }

  public fetchFormData = () => {
    const { actions, mallId, poiMallZoneId } = this.props;
    if (!poiMallZoneId) {
      return;
    }
    actions.fetchPoiMallZone(mallId, poiMallZoneId);
    this.fetchTranslationData();
  };

  public fetchTranslationData = () => {
    const { actions, mallId, poiMallZoneId } = this.props;
    if (!poiMallZoneId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchPoiMallZone(mallId, poiMallZoneId, lang);
    });
  };

  // public fetchMallData = () => {
  //   const { actions, mallId } = this.props;
  //   actions.fetchPoiTypeList(mallId);
  // };

  public handleSubmit = (
    poiMallZone: PoiMallZone,
    translations: TypedLooseObject<PoiMallZoneTranslationFormProps>
  ) => {
    this.props.onSubmit(poiMallZone, translations);
  };

  public handleFailure = () => {
    this.props.onFailure(this.props.error);
  };

  public handleSuccess = () => {
    this.props.onSuccess();
  };

  public render() {
    const {
      isLoading,
      poiMallZone,
      // poiTypes,
      translations,
      currentLang,
    } = this.props;
    return (
      <Spin spinning={isLoading}>
        <PoiMallZoneForm
          defaultData={poiMallZone}
          onSubmit={this.handleSubmit}
          // poiTypes={poiTypes}
          translations={translations}
          currentLang={currentLang}
        />
      </Spin>
    );
  }
}

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const { mallId, poiMallZoneId } = props;
  const currentLang = state.locale.lang;
  const translations = !poiMallZoneId
    ? ({} as TypedLooseObject<PoiMallZone>)
    : languages
        .filter((l) => l !== currentLang)
        .reduce(
          (acc, lang) => {
            const tpoiMallZone = getTranslatedPoiMallZoneById(
              state,
              poiMallZoneId,
              lang
            );
            return {
              ...acc,
              ...(tpoiMallZone && { [lang]: { ...tpoiMallZone } }),
            };
          },
          {} as TypedLooseObject<PoiMallZone>
        );
  return {
    saved: state.poiMallZones.saved,
    error: state.poiMallZones.error,
    isLoading: state.poiMallZones.isLoading,
    poiMallZone: getPoiMallZoneById(state, `${poiMallZoneId}`),
    poiMallZones: getPoiMallZonesByMallId(state, mallId),
    // poiTypes: getPoiTypeList(state),
    translations,
    currentLang,
  };
};

// const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
//   return {
//     actions: bindActionCreators(
//       {
//         fetchtPoiMallZone: poiMallZoneActions.fetchEntity,
//         selectMall: mallActions.selectMall,
//       },
//       dispatch
//     ),
//   };
// };

export default connect<StateProps, DispatchProps>(
  mapStateToProps
  // mapDispatchToProps
)(ControlledPoiMallZoneForm);
