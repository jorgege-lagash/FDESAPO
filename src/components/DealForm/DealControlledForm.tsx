import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as dealActions } from 'src/actions/deal.action';
import DealForm from 'src/components/DealForm/DealForm';
import { ApplicationState } from 'src/reducers';
import {
  getDealById,
  getTranslatedDealById,
} from 'src/selectors/deal.selector';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Deal } from 'src/types/response/Deal';
import { DealTranslationFormProps } from 'src/types/TranslationForm';

interface StateProps {
  error?: any;
  isLoading: boolean;
  deal: Deal | null;
  currentLang: string;
  saved: boolean;
  translations: TypedLooseObject<Deal>;
}

interface DispatchProps {
  actions: {
    fetchDeal: typeof dealActions.fetchEntity;
  };
}
interface OwnProps {
  mallId: number;
  dealId?: number;
  timezone: string;
  onSuccess: () => void;
  onFailure: (error: any) => void;
  onSubmit: (
    deal: Deal,
    translations: TypedLooseObject<DealTranslationFormProps>
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
    initialDeal: {},
  };

  public componentDidMount() {
    this.fetchFormData();
  }

  public componentDidUpdate(prevProps: Props) {
    const { error, saved, mallId, dealId } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }
    if (!prevProps.error && error) {
      this.handleFailure();
    }

    if (prevProps.mallId !== mallId) {
      this.fetchFormData();
    }
    if (prevProps.dealId !== dealId) {
      this.fetchFormData();
    }
  }

  public fetchFormData = () => {
    const { actions, mallId, dealId } = this.props;
    if (!dealId) {
      return;
    }
    actions.fetchDeal(mallId, dealId);
    this.fetchTranslationData();
  };

  public fetchTranslationData = () => {
    const { actions, mallId, dealId } = this.props;
    if (!dealId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchDeal(mallId, dealId, lang);
    });
  };

  public handleSubmit = (
    deal: Deal,
    translations: TypedLooseObject<DealTranslationFormProps>
  ) => {
    this.props.onSubmit(deal, translations);
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
      deal,
      translations,
      currentLang,
      mallId,
      timezone,
    } = this.props;
    return (
      <Spin spinning={isLoading}>
        <DealForm
          mallId={mallId}
          defaultData={deal}
          onSubmit={this.handleSubmit}
          translations={translations}
          currentLang={currentLang}
          timezone={timezone}
        />
      </Spin>
    );
  }
}

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const { dealId } = props;
  const currentLang = state.locale.lang;
  const translations = !dealId
    ? ({} as TypedLooseObject<Deal>)
    : languages
        .filter((l) => l !== currentLang)
        .reduce(
          (acc, lang) => {
            const tdata = getTranslatedDealById(state, dealId, lang);
            return {
              ...acc,
              ...(tdata && { [lang]: { ...tdata } }),
            };
          },
          {} as TypedLooseObject<Deal>
        );
  return {
    saved: state.deals.saved,
    error: state.deals.error,
    isLoading: state.deals.isLoading,
    deal: getDealById(state, `${dealId}`),
    translations,
    currentLang,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchDeal: dealActions.fetchEntity,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(ControlledFeaturedSpaceForm);
