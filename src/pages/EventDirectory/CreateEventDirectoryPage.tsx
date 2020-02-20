import React from 'react';

import { Card, notification } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions as eventDirectoryActions } from 'src/actions/event-directory.action';
import ControlledEventDirectoryForm from 'src/components/EventDirectoryForm/ControlledEventDirectoryForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { ApplicationState } from 'src/reducers';
import { getMallById } from 'src/selectors/mall.selector';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { EventDirectoryTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';

interface StateProps {
  error?: any;
  isLoading: boolean;
  mallId: number;
  saved: boolean;
  timezone: string;
}

interface DispatchProps {
  actions: {
    createEventDirectory: typeof eventDirectoryActions.createEntity;
  };
}

type Props = StateProps & DispatchProps & InjectedIntlProps;

class CreateEventDirectoryPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
  };

  public handleSubmit = (
    data: EventDirectory,
    translations: TypedLooseObject<EventDirectoryTranslationFormProps>
  ) => {
    this.props.actions.createEventDirectory(
      this.props.mallId,
      data,
      translations
    );
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Evento creado',
      description: 'Evento creado correctamente',
    });
  };

  public handleFailure = (error: ApiError) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de crear el evento.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'eventDirectory.label'
    );
    notification.error({
      message: 'Error',
      description: content,
    });
  };

  public render() {
    const { mallId, timezone } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Crear Evento'}>
        <Card>
          {this.state.redirect && <Redirect to={`${baseUrl}/events/list`} />}
          <ControlledEventDirectoryForm
            mallId={mallId}
            onSubmit={this.handleSubmit}
            onSuccess={this.handleSuccess}
            onFailure={this.handleFailure}
            timezone={timezone}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export const mapStateToProps = (state: ApplicationState): StateProps => {
  const mallId = state.malls.selectedMall || 0;
  const mall = getMallById(state, state.malls.selectedMall || 0);
  const timezone = mall.timezone;
  return {
    mallId,
    saved: state.events.saved,
    error: state.events.error,
    isLoading: state.events.isLoading,
    timezone,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        createEventDirectory: eventDirectoryActions.createEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(CreateEventDirectoryPage);
export default injectIntl(connectedComponent, { withRef: true });
