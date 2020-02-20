import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as timeZonesActions } from 'src/actions/time-zones.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { MallTranslationFormProps } from 'src/types/TranslationForm';
import { actions as mallActions } from '../../actions/mall.action';
import { actions as scheduleActions } from '../../actions/schedule.action';
import UpdateMallForm from '../../components/UpdateMallForm/UpdateMallForm';
import { ApplicationState } from '../../reducers';
import {
  getMallById,
  getTranslatedMallById,
} from '../../selectors/mall.selector';
import { Mall } from '../../types/Mall';

interface StateProps {
  error?: any;
  saved: boolean;
  isLoading: boolean;
  mallId: number;
  mall: Mall;
  currentLang: string;
  translations: TypedLooseObject<Mall>;
  timezones: string[];
}

interface DispatchProps {
  actions: {
    updateMall: typeof mallActions.updateMall;
    fetchMall: typeof mallActions.fetchMall;
    fetchScheduleList: typeof scheduleActions.fetchScheduleList;
    fetchTimeZonesList: typeof timeZonesActions.fetchTimeZonesList;
  };
}

type Props = StateProps & DispatchProps & RouteComponentProps<{ id: string }>;

class UpdateMallPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialMall: {},
  };

  public componentDidMount() {
    const { mall, mallId } = this.props;
    if (!this.props.mall) {
      this.props.actions.fetchMall(mallId);
    } else {
      this.props.actions.fetchScheduleList(mall.id, 'default');
    }
    this.props.actions.fetchTimeZonesList(mallId || 1);
    this.fetchFormData();
  }

  public componentDidUpdate(prevProps: Props) {
    const { error, saved, mallId } = this.props;
    if (!prevProps.saved && saved) {
      this.handleSuccess();
    }

    if (!prevProps.error && error) {
      this.handleFailure(error);
    }

    if (prevProps.mallId !== mallId) {
      this.fetchFormData();
    }
  }

  public handleSubmit = (
    mall: Mall,
    translations: TypedLooseObject<MallTranslationFormProps>
  ) => {
    const data = Object.keys(mall).reduce(
      (acc, key) => {
        if (
          mall[key] !== undefined &&
          this.state.initialMall[key] !== mall[key]
        ) {
          acc[key] = mall[key];
        }
        return acc;
      },
      {} as Partial<Mall>
    );
    this.props.actions.updateMall(
      Number(this.props.match.params.id),
      data,
      translations
    );
  };

  public handleFailure = (error: ApiError) => {
    notification.error({
      message: 'Error',
      description: 'Hubo un error al momento de actualizar el mall.',
    });
  };

  public handleSuccess = () => {
    notification.success({
      message: 'Mall actualizado',
      description: 'Mall actualizado correctamente',
    });
    this.setState({
      redirect: true,
    });
  };

  public fetchFormData = () => {
    const { actions, mallId } = this.props;
    actions.fetchMall(mallId);
    actions.fetchScheduleList(mallId, 'default');
    this.fetchTranslationData();
  };

  public fetchTranslationData = () => {
    const { actions, mallId } = this.props;
    languages.forEach((lang) => {
      actions.fetchMall(mallId, lang);
    });
  };

  public render() {
    const { isLoading, translations, currentLang, timezones } = this.props;
    return (
      <PageHeaderWrapper>
        {this.state.redirect && <Redirect to="/cms/malls/list" />}
        <Card>
          <Spin spinning={isLoading}>
            <UpdateMallForm
              defaultData={this.props.mall}
              onSubmit={this.handleSubmit}
              translations={translations}
              currentLang={currentLang}
              timeZones={timezones}
            />
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (
  state: ApplicationState,
  props: Props
): StateProps => {
  const { match } = props;
  const mallId = Number(match.params.id) || 0;
  const currentLang = state.locale.lang;
  const saved = state.malls.saved;
  const timezones = state.timeZones.list;
  return {
    saved,
    mallId,
    error: state.malls.error,
    isLoading: state.malls.isLoading,
    mall: getMallById(state, props.match.params.id),
    currentLang,
    timezones,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tpoi = getTranslatedMallById(state, mallId, lang);
          return {
            ...acc,
            ...(tpoi && { [lang]: { ...tpoi } }),
          };
        },
        {} as TypedLooseObject<Mall>
      ),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updateMall, fetchMall } = mallActions;
  const { fetchScheduleList } = scheduleActions;
  const { fetchTimeZonesList } = timeZonesActions;
  return {
    actions: bindActionCreators(
      {
        updateMall,
        fetchMall,
        fetchScheduleList,
        fetchTimeZonesList,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(UpdateMallPage);

export default withRouter(connectedComponent);
