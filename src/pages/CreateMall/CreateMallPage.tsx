import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { actions } from 'src/actions/mall.action';
import { actions as timeZonesActions } from 'src/actions/time-zones.action';

import CreateMallForm from 'src/components/CreateMallForm/CreateMallForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { MallTranslationFormProps } from 'src/types/TranslationForm';
import { Mall } from '../../types/Mall';

interface StateFromProps {
  error?: any;
  isLoading: boolean;
  userId: number;
  currentLang: string;
  mallId?: number;
  timeZones: string[];
}

interface DispatchFromProps {
  actions: {
    createMall: typeof actions.createMall;
    fetchTimeZonesList: typeof timeZonesActions.fetchTimeZonesList;
  };
}

type MallPageProps = StateFromProps & DispatchFromProps;

class CreateMallPage extends React.PureComponent<MallPageProps> {
  public state = {
    redirect: false,
  };

  public componentWillReceiveProps(nextProps: MallPageProps) {
    const { error, isLoading } = this.props;
    const { error: nextError, isLoading: nextIsLoading } = nextProps;
    if (
      nextError &&
      error !== nextError &&
      (nextError.statusCode === 404 || nextError.statusCode === 400)
    ) {
      this.handleMallFailure();
    }
    if (
      nextError === null &&
      isLoading !== nextIsLoading &&
      nextIsLoading === false
    ) {
      this.handleMallSuccess();
    }
  }

  public handleSubmit = (
    mallData: Mall,
    translation: TypedLooseObject<MallTranslationFormProps>
  ) => {
    this.props.actions.createMall(this.props.userId, mallData, translation);
  };

  public handleMallFailure = () => {
    notification.error({
      message: 'Error',
      description:
        'Hubo un error al momento de crear el mall. Ya existe un mall con el ID o codigo de edificio ingresado.',
    });
  };

  public handleMallSuccess = () => {
    notification.success({
      message: 'Mall creado',
      description: 'Mall creado correctamente',
    });
    this.setState({
      redirect: true,
    });
  };

  public componentDidCatch() {
    const { mallId } = this.props;
    const url = mallId ? `/cms/mall/${mallId}` : '/login';
    return <Redirect to={url} />;
  }

  public componentDidMount() {
    const { mallId } = this.props;
    this.props.actions.fetchTimeZonesList(mallId || 1);
  }

  public render() {
    const { isLoading, currentLang, timeZones } = this.props;
    const { redirect } = this.state;
    return redirect ? (
      <Redirect to="/cms/malls/list" />
    ) : (
      <PageHeaderWrapper title={'Crear Mall'}>
        <Card>
          <Spin spinning={isLoading}>
            <CreateMallForm
              currentLang={currentLang}
              timeZones={timeZones}
              onSubmit={this.handleSubmit}
            />
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (state: ApplicationState): StateFromProps => {
  const currentLang = state.locale.lang;
  const mallId = state.malls.selectedMall;
  const timeZones = state.timeZones.list;
  return {
    userId: state.session.userData!.userId,
    error: state.malls.error,
    isLoading: state.malls.isLoading,
    currentLang,
    mallId,
    timeZones,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchFromProps => {
  const { createMall } = actions;
  const { fetchTimeZonesList } = timeZonesActions;
  return {
    actions: bindActionCreators({ createMall, fetchTimeZonesList }, dispatch),
  };
};

const connectedComponent = connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreateMallPage);
export default connectedComponent;
