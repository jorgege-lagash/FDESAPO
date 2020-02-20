import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as categoryActions } from 'src/actions/category.action';
import { actions as channelActions } from 'src/actions/channel.action';
import { actions as maasActions } from 'src/actions/maas.action';
import { actions as mallActions } from 'src/actions/mall.action';
import { actions as poiStateActions } from 'src/actions/poi-state.action';
import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import { actions as poiActions } from 'src/actions/poi.action';
import { actions as tagActions } from 'src/actions/tag.action';
import { actions as travelerDiscountActions } from 'src/actions/traveler-discount.action';
import { ApplicationState } from 'src/reducers';
import { getCategoriesByMallId } from 'src/selectors/category.selector';
import { getGlobalChannelList } from 'src/selectors/channel.selector';
import { getfileById } from 'src/selectors/file.selector';
import { selectPwPoisByBuildingId } from 'src/selectors/maas.selector';
import { getMallById } from 'src/selectors/mall.selector';
import { getPoiStateList } from 'src/selectors/poi-state.selector';
import { getPoiTypeList } from 'src/selectors/poi-type.selector';
import { getPoiById, getTranslatedPoiById } from 'src/selectors/poi.selector';
import { getTagsByMallId } from 'src/selectors/tag.selector';
import {
  getTranslatedTravelerDiscountById,
  getTravelerDiscountById,
} from 'src/selectors/traveler-discount.selector';
import { initialHistory } from 'src/store';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Category } from 'src/types/response/Category';
import { Channel } from 'src/types/response/Channel';
import { FileDTO } from 'src/types/response/FileDTO';
import { Poi, PoiFormData } from 'src/types/response/POI';
import { PoiState } from 'src/types/response/PoiState';
import { PoiType } from 'src/types/response/PoiType';
import { PwPoi } from 'src/types/response/PwPoi';
import { Tag } from 'src/types/response/Tag';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import { PoiTranslationFormProps } from 'src/types/TranslationForm';
import { parseObjectListIds } from 'src/utils';
import { createMallDependentUrl } from 'src/utils';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import PoiForm from './PoiForm';

interface StateProps {
  error?: any;
  isLoading: boolean;
  saved: boolean;
  isLoadingPwPois: boolean;
  isLoadingCategories: boolean;
  discountId: number;
  travelerDiscount: TravelerDiscount | null;
  poi: Poi | null;
  categories: Category[];
  tags: Tag[];
  channels: Channel[];
  poiTypes: PoiType[];
  poiStates: PoiState[];
  pwPois: PwPoi[];
  currentLang: string;
  translations: TypedLooseObject<Poi>;
  discountTranslations: TypedLooseObject<TravelerDiscount>;
  pwPoiById: TypedLooseObject<PwPoi>;
  logoDTO: FileDTO | null;
}

interface DispatchProps {
  actions: {
    fetchPoi: typeof poiActions.fetchPoi;
    selectMall: typeof mallActions.selectMall;
    fetchPwPoiList: typeof maasActions.fetchPwPoiList;
    fetchChannelList: typeof channelActions.fetchChannelList;
    fetchPoiTypeList: typeof poiTypeActions.fetchEntityList;
    fetchCategoryList: typeof categoryActions.fetchPagedEntityList;
    fetchTravelerDiscount: typeof travelerDiscountActions.fetchEntity;
    fetchTagList: typeof tagActions.fetchPagedEntityList;
    fetchPoiStateList: typeof poiStateActions.fetchEntityList;
  };
}

interface OwnProps {
  mallId: number;
  poiId?: number;
  onSuccess: () => void;
  onFailure: (error: any) => void;
  onSubmit: (
    store: PoiFormData,
    translations: TypedLooseObject<PoiTranslationFormProps>,
    newTags: Tag[]
  ) => void;
}

type Props = DispatchProps & StateProps & OwnProps;

const defaultProps = {
  onSuccess: () => undefined,
  onFailure: () => undefined,
};

class ControlledPoiForm extends React.Component<Props> {
  public static defaultProps = defaultProps;
  public state = {
    initialPoi: {},
  };

  public componentDidMount() {
    const { mallId, actions, poi, discountId } = this.props;

    this.fetchFormData();
    this.fetchTranslationData();
    this.fetchMallData();
    this.fetchPoiStateData();
    if (poi && mallId !== poi.mallId) {
      actions.selectMall(poi.mallId);
    }
    if (discountId) {
      this.fetchDiscountData();
      this.fetchDiscountTranslationData();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      error,
      saved,
      mallId,
      poiId,
      poi,
      actions,
      discountId,
    } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }

    if (!prevProps.error && error) {
      this.handleFailure();
    }

    if (prevProps.mallId !== mallId) {
      this.fetchFormData();
      this.fetchTranslationData();
      this.fetchMallData();
    }

    if (Number(prevProps.poiId) !== Number(poiId)) {
      this.fetchFormData();
      this.fetchTranslationData();
    }

    if (Number(prevProps.discountId) !== Number(discountId)) {
      this.fetchDiscountData();
      this.fetchDiscountTranslationData();
    }

    if (poi && mallId !== Number(poi.mallId)) {
      actions.selectMall(poi.mallId);
      actions.fetchPwPoiList(poi.mallId);
    }
    if (prevProps.poi !== poi) {
      this.fetchTranslationData();
    }
  }

  public fetchFormData = () => {
    const { actions, mallId, poiId, discountId } = this.props;
    if (!poiId) {
      return;
    }
    actions.fetchPoi(mallId, poiId);
    if (!discountId) {
      return;
    }
    actions.fetchTravelerDiscount(mallId, discountId);
  };

  public fetchTranslationData = () => {
    const { actions, mallId, poiId, discountId } = this.props;
    if (!poiId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchPoi(mallId, poiId, lang);
      if (discountId) {
        actions.fetchTravelerDiscount(mallId, discountId, lang);
      }
    });
  };

  public fetchDiscountData() {
    const { actions, mallId, discountId } = this.props;
    if (!discountId) {
      return;
    }
    actions.fetchTravelerDiscount(mallId, discountId);
  }

  public fetchDiscountTranslationData = () => {
    const { actions, mallId, discountId } = this.props;
    if (!discountId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchTravelerDiscount(mallId, discountId, lang);
    });
  };

  public fetchPoiStateData() {
    const { mallId, actions } = this.props;
    actions.fetchPoiStateList(mallId);
  }

  public fetchMallData = () => {
    const { actions, mallId } = this.props;
    actions.fetchCategoryList(mallId, 1, 1000);
    actions.fetchChannelList(mallId, 1, 1000);
    actions.fetchPoiTypeList(mallId);
    actions.fetchTagList(mallId, 1, 1000);
    if (this.props.pwPois.length === 0) {
      actions.fetchPwPoiList(mallId);
    }
  };

  public handleSubmit = (
    store: PoiFormData,
    translations: TypedLooseObject<PoiTranslationFormProps>,
    newTags: Tag[]
  ) => {
    this.props.onSubmit(store, translations, newTags);
  };

  public handleFailure = () => {
    this.props.onFailure(this.props.error);
  };
  public handleCancelAction = () => {
    const baseUrl = createMallDependentUrl(this.props.mallId, '/pois/list');
    initialHistory.push(baseUrl);
  };
  public handleSuccess = () => {
    this.props.onSuccess();
  };
  public render() {
    const {
      categories,
      tags,
      poiTypes,
      pwPois,
      isLoadingPwPois,
      channels,
      currentLang,
      discountId,
      discountTranslations,
      translations,
      poi,
      poiStates,
      travelerDiscount,
      isLoadingCategories,
      isLoading,
      pwPoiById,
      logoDTO,
    } = this.props;
    const loading = isLoading || isLoadingCategories;
    return (
      <Spin spinning={loading}>
        <ErrorBoundary>
          <PoiForm
            isLoadingCategories={isLoadingCategories}
            translations={translations}
            discountId={discountId}
            logoData={logoDTO}
            defaultDiscountData={travelerDiscount}
            discountTranslations={discountTranslations}
            isLoadingPwPois={isLoadingPwPois}
            defaultData={poi}
            onSubmit={this.handleSubmit}
            categories={categories}
            tags={tags}
            poiStates={poiStates}
            poiTypes={poiTypes}
            pwPois={pwPois}
            channels={channels}
            currentLang={currentLang}
            pwPoiById={pwPoiById}
            onCancelAction={this.handleCancelAction}
          />
        </ErrorBoundary>
      </Spin>
    );
  }
}

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const poiId = Number(props.poiId) || 0;
  const mallId = Number(props.mallId) || 0;
  const mall = getMallById(state, mallId);
  const buildingId = mall ? Number(mall.buildingId) : 0;
  const currentLang = state.locale.lang;
  const poi = getPoiById(state, poiId);
  const pwPoiById = state.entities.pwpois;
  const discountId = poi
    ? parseObjectListIds(poi.travelerDiscounts)[0] || 0
    : 0;
  const logoId = poi ? poi.logo || 0 : 0;
  const travelerDiscount = getTravelerDiscountById(state, discountId);
  const logoDTO = getfileById(state, logoId as number);
  return {
    saved: state.pois.saved,
    error: state.pois.error,
    isLoading: state.pois.isLoading,
    isLoadingPwPois: state.pwpois.isLoading,
    isLoadingCategories: state.categories.isLoading,
    pwPoiById,
    poi,
    discountId,
    logoDTO,
    travelerDiscount,
    categories: getCategoriesByMallId(state, mallId),
    tags: getTagsByMallId(state, mallId),
    poiStates: getPoiStateList(state),
    poiTypes: getPoiTypeList(state),
    pwPois: selectPwPoisByBuildingId(state, buildingId),
    channels: getGlobalChannelList(state),
    currentLang,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce<TypedLooseObject<Poi>>((acc, lang) => {
        const tpoi = getTranslatedPoiById(state, poiId, lang);
        return {
          ...acc,
          ...(tpoi && { [lang]: { ...tpoi } }),
        };
      }, {}),
    discountTranslations: languages
      .filter((l) => l !== currentLang)
      .reduce<TypedLooseObject<TravelerDiscount>>((acc, lang) => {
        const tdiscount = getTranslatedTravelerDiscountById(
          state,
          discountId,
          lang
        );
        return {
          ...acc,
          ...(tdiscount && { [lang]: { ...tdiscount } }),
        };
      }, {}),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchPoi } = poiActions;
  return {
    actions: bindActionCreators(
      {
        fetchPoi,
        fetchCategoryList: categoryActions.fetchPagedEntityList,
        fetchTagList: tagActions.fetchPagedEntityList,
        fetchPoiTypeList: poiTypeActions.fetchEntityList,
        selectMall: mallActions.selectMall,
        fetchPwPoiList: maasActions.fetchPwPoiList,
        fetchChannelList: channelActions.fetchChannelList,
        fetchTravelerDiscount: travelerDiscountActions.fetchEntity,
        fetchPoiStateList: poiStateActions.fetchEntityList,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(ControlledPoiForm);
