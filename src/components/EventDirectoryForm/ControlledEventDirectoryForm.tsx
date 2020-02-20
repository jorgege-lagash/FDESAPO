import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as eventActions } from 'src/actions/event-directory.action';
import { actions as mallActions } from 'src/actions/mall.action';
import EventDirectoryForm from 'src/components/EventDirectoryForm/EventDirectoryForm';
import { ApplicationState } from 'src/reducers';
import {
  getEventDirectoryById,
  getTranslatedEventDirectoryById,
} from 'src/selectors/event-directory.selector';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { EventDirectoryTranslationFormProps } from 'src/types/TranslationForm';

interface StateProps {
  error?: any;
  isLoading: boolean;
  event: EventDirectory | null;
  currentLang: string;
  saved: boolean;
  translations: TypedLooseObject<EventDirectory>;
}

interface DispatchProps {
  actions: {
    fetchEventDirectory: typeof eventActions.fetchEntity;
    selectMall: typeof mallActions.selectMall;
  };
}
interface OwnProps {
  mallId: number;
  eventId?: number;
  timezone: string;
  onSuccess: () => void;
  onFailure: (error: any) => void;
  onSubmit: (
    event: EventDirectory,
    translations: TypedLooseObject<EventDirectoryTranslationFormProps>
  ) => void;
}
const defaultProps = {
  onSuccess: () => undefined,
  onFailure: () => undefined,
};

type Props = OwnProps & StateProps & DispatchProps;

class ControlledEventDirectoryForm extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;
  public state = {
    initialEventDirectory: {},
  };

  public componentDidMount() {
    const { mallId, actions, event } = this.props;

    this.fetchFormData();
    if (event && mallId !== event.mallId) {
      actions.selectMall(event.mallId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { error, saved, mallId, eventId, event, actions } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }
    if (!prevProps.error && error) {
      this.handleFailure();
    }

    if (prevProps.mallId !== mallId) {
      this.fetchFormData();
    }
    if (prevProps.eventId !== eventId) {
      this.fetchFormData();
    }
    if (event && mallId !== event.mallId) {
      actions.selectMall(event.mallId);
    }
  }

  public fetchFormData = () => {
    const { actions, mallId, eventId } = this.props;
    if (!eventId) {
      return;
    }
    actions.fetchEventDirectory(mallId, eventId);
    this.fetchTranslationData();
  };

  public fetchTranslationData = () => {
    const { actions, mallId, eventId } = this.props;
    if (!eventId) {
      return;
    }
    languages.forEach((lang) => {
      actions.fetchEventDirectory(mallId, eventId, lang);
    });
  };

  public handleSubmit = (
    event: EventDirectory,
    translations: TypedLooseObject<EventDirectoryTranslationFormProps>
  ) => {
    this.props.onSubmit(event, translations);
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
      event,
      translations,
      currentLang,
      timezone,
    } = this.props;
    return (
      <Spin spinning={isLoading}>
        <EventDirectoryForm
          defaultData={event}
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
  const { eventId } = props;
  const currentLang = state.locale.lang;
  const translations = !eventId
    ? ({} as TypedLooseObject<EventDirectory>)
    : languages
        .filter((l) => l !== currentLang)
        .reduce(
          (acc, lang) => {
            const tdata = getTranslatedEventDirectoryById(state, eventId, lang);
            return {
              ...acc,
              ...(tdata && { [lang]: { ...tdata } }),
            };
          },
          {} as TypedLooseObject<EventDirectory>
        );
  return {
    saved: state.events.saved,
    error: state.events.error,
    isLoading: state.events.isLoading,
    event: getEventDirectoryById(state, `${eventId}`),
    translations,
    currentLang,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchEventDirectory: eventActions.fetchEntity,
        selectMall: mallActions.selectMall,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(ControlledEventDirectoryForm);
