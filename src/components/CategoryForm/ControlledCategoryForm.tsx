import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as categoryActions } from 'src/actions/category.action';
import { actions as mallActions } from 'src/actions/mall.action';
import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import CategoryForm from 'src/components/CategoryForm/CategoryForm';
import { ApplicationState } from 'src/reducers';
import { getCategoriesByMallId } from 'src/selectors/category.selector';
import {
  getCategoryById,
  getTranslatedCategoryById,
} from 'src/selectors/category.selector';
import { getPoiTypeList } from 'src/selectors/poi-type.selector';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Category } from 'src/types/response/Category';
import { PoiType } from 'src/types/response/PoiType';
import { CategoryTranslationFormProps } from 'src/types/TranslationForm';

interface StateProps {
  error?: any;
  isLoading: boolean;
  category: Category | null;
  currentLang: string;
  saved: boolean;
  categories: Category[];
  poiTypes: PoiType[];
  translations: TypedLooseObject<Category>;
}

interface DispatchProps {
  actions: {
    fetchCategory: typeof categoryActions.fetchEntity;
    fetchPoiTypeList: typeof poiTypeActions.fetchEntityList;
    selectMall: typeof mallActions.selectMall;
  };
}
interface OwnProps {
  mallId: number;
  categoryId?: number;
  onSuccess: () => void;
  onFailure: (error: any) => void;
  onSubmit: (
    category: Category,
    translations: TypedLooseObject<CategoryTranslationFormProps>
  ) => void;
}
const defaultProps = {
  onSuccess: () => undefined,
  onFailure: () => undefined,
};

type Props = OwnProps & StateProps & DispatchProps;

class ControlledCategoryForm extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;
  public state = {
    initialCategory: {},
  };

  public componentDidMount() {
    const { mallId, actions, category } = this.props;

    this.fetchFormData();
    actions.fetchPoiTypeList(mallId);
    if (category && mallId !== category.mallId) {
      actions.selectMall(category.mallId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { error, saved, mallId, categoryId, category, actions } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }
    if (!prevProps.error && error) {
      this.handleFailure();
    }

    if (prevProps.mallId !== mallId) {
      this.fetchFormData();
      this.fetchMallData();
    }
    if (prevProps.categoryId !== categoryId) {
      this.fetchFormData();
    }
    if (category && mallId !== category.mallId) {
      actions.selectMall(category.mallId);
      actions.fetchPoiTypeList(mallId);
    }
  }

  public fetchFormData = () => {
    const { actions, mallId, categoryId } = this.props;
    if (!categoryId) {
      return;
    }
    actions.fetchCategory(mallId, categoryId);
    this.fetchTranslationData();
  };

  public fetchTranslationData = () => {
    const { actions, mallId, categoryId } = this.props;
    if (!categoryId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchCategory(mallId, categoryId, lang);
    });
  };

  public fetchMallData = () => {
    const { actions, mallId } = this.props;
    actions.fetchPoiTypeList(mallId);
  };

  public handleSubmit = (
    category: Category,
    translations: TypedLooseObject<CategoryTranslationFormProps>
  ) => {
    this.props.onSubmit(category, translations);
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
      category,
      poiTypes,
      translations,
      currentLang,
    } = this.props;
    return (
      <Spin spinning={isLoading}>
        <CategoryForm
          defaultData={category}
          onSubmit={this.handleSubmit}
          poiTypes={poiTypes}
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
  const { mallId, categoryId } = props;
  const currentLang = state.locale.lang;
  const translations = !categoryId
    ? ({} as TypedLooseObject<Category>)
    : languages.filter((l) => l !== currentLang).reduce(
        (acc, lang) => {
          const tcategory = getTranslatedCategoryById(state, categoryId, lang);
          return {
            ...acc,
            ...(tcategory && { [lang]: { ...tcategory } }),
          };
        },
        {} as TypedLooseObject<Category>
      );
  return {
    saved: state.categories.saved,
    error: state.categories.error,
    isLoading: state.categories.isLoading,
    category: getCategoryById(state, `${categoryId}`),
    categories: getCategoriesByMallId(state, mallId),
    poiTypes: getPoiTypeList(state),
    translations,
    currentLang,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchCategory: categoryActions.fetchEntity,
        fetchPoiTypeList: poiTypeActions.fetchEntityList,
        selectMall: mallActions.selectMall,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(ControlledCategoryForm);
