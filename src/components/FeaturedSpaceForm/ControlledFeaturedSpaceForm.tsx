import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as featureSpaceTypeActions } from 'src/actions/feature-space-type.action';
import { actions as featuredSpaceActions } from 'src/actions/featured-space.action';
import { actions as mallActions } from 'src/actions/mall.action';
import FeaturedSpaceForm from 'src/components/FeaturedSpaceForm/FeaturedSpaceForm';
import { ApplicationState } from 'src/reducers';
import { getFeatureSpaceTypeList } from 'src/selectors/feature-space-type.selector';
import {
  getFeaturedSpaceById,
  getTranslatedFeaturedSpaceById,
} from 'src/selectors/featured-space.selector';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FeatureSpaceType } from 'src/types/response/FeatureSpaceType';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';

interface StateProps {
  error?: any;
  isLoading: boolean;
  featuredSpace: FeaturedSpace | null;
  featureSpaceTypes: FeatureSpaceType[];
  currentLang: string;
  saved: boolean;
  translations: TypedLooseObject<FeaturedSpace>;
}

interface DispatchProps {
  actions: {
    fetchFeaturedSpace: typeof featuredSpaceActions.fetchEntity;
    selectMall: typeof mallActions.selectMall;
    fetchFeatureSpaceTypes: typeof featureSpaceTypeActions.fetchEntityList;
  };
}
interface OwnProps {
  mallId: number;
  featuredSpaceId?: number;
  onSuccess: () => void;
  onFailure: (error: any) => void;
  onSubmit: (
    featuredSpace: FeaturedSpace,
    translations: TypedLooseObject<FeaturedSpaceTranslationFormProps>
  ) => void;
}
const defaultProps = {
  onSuccess: () => undefined,
  onFailure: () => undefined,
};

type Props = OwnProps & StateProps & DispatchProps;

class ControlledFeaturedSpaceForm extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;
  public state = {
    initialFeaturedSpace: {},
  };

  public componentDidMount() {
    const { mallId, actions, featuredSpace } = this.props;

    actions.fetchFeatureSpaceTypes(mallId);
    this.fetchFormData();
    if (featuredSpace && mallId !== featuredSpace.mallId) {
      actions.selectMall(featuredSpace.mallId);
      actions.fetchFeatureSpaceTypes(featuredSpace.mallId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      error,
      saved,
      mallId,
      featuredSpaceId,
      featuredSpace,
      actions,
    } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }
    if (!prevProps.error && error) {
      this.handleFailure();
    }

    if (prevProps.mallId !== mallId) {
      actions.fetchFeatureSpaceTypes(mallId);

      this.fetchFormData();
    }
    if (prevProps.featuredSpaceId !== featuredSpaceId) {
      this.fetchFormData();
    }
    if (featuredSpace && mallId !== featuredSpace.mallId) {
      actions.selectMall(featuredSpace.mallId);
    }
  }

  public fetchFormData = () => {
    const { actions, mallId, featuredSpaceId } = this.props;
    if (!featuredSpaceId) {
      return;
    }
    actions.fetchFeaturedSpace(mallId, featuredSpaceId);
    this.fetchTranslationData();
  };

  public fetchTranslationData = () => {
    const { actions, mallId, featuredSpaceId } = this.props;
    if (!featuredSpaceId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchFeaturedSpace(mallId, featuredSpaceId, lang);
    });
  };

  public handleSubmit = (
    featuredSpace: FeaturedSpace,
    translations: TypedLooseObject<FeaturedSpaceTranslationFormProps>
  ) => {
    this.props.onSubmit(featuredSpace, translations);
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
      featuredSpace,
      translations,
      currentLang,
      featureSpaceTypes,
    } = this.props;
    return (
      <Spin spinning={isLoading}>
        <FeaturedSpaceForm
          featureSpaceTypes={featureSpaceTypes}
          defaultData={featuredSpace}
          onSubmit={this.handleSubmit}
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
  const { featuredSpaceId } = props;
  const currentLang = state.locale.lang;
  const featureSpaceTypes = getFeatureSpaceTypeList(state);
  const translations = !featuredSpaceId
    ? ({} as TypedLooseObject<FeaturedSpace>)
    : languages
        .filter((l) => l !== currentLang)
        .reduce(
          (acc, lang) => {
            const tdata = getTranslatedFeaturedSpaceById(
              state,
              featuredSpaceId,
              lang
            );
            return {
              ...acc,
              ...(tdata && { [lang]: { ...tdata } }),
            };
          },
          {} as TypedLooseObject<FeaturedSpace>
        );
  return {
    featureSpaceTypes,
    saved: state.featuredSpaces.saved,
    error: state.featuredSpaces.error,
    isLoading: state.featuredSpaces.isLoading,
    featuredSpace: getFeaturedSpaceById(state, `${featuredSpaceId}`),
    translations,
    currentLang,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchFeaturedSpace: featuredSpaceActions.fetchEntity,
        selectMall: mallActions.selectMall,
        fetchFeatureSpaceTypes: featureSpaceTypeActions.fetchEntityList,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(ControlledFeaturedSpaceForm);
