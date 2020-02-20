import React from 'react';

import { Card, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import ControlledEventDirectoryForm from 'src/components/EventDirectoryForm/ControlledEventDirectoryForm';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import { getMallById } from 'src/selectors/mall.selector';
import { TypedLooseObject } from 'src/types/LooseObject';
import { EventDirectoryTranslationFormProps } from 'src/types/TranslationForm';
import { createMallDependentUrl } from 'src/utils';
import { buildErrorMessageContent } from 'src/utils/api-error.util';
import { actions } from '../../actions/event-directory.action';
import { ApplicationState } from '../../reducers';
import { EventDirectory } from '../../types/response/EventDirectory';

interface StateProps {
  isLoading: boolean;
  mallId: number;
  eventId: number;
  timezone: string;
}

interface DispatchProps {
  actions: {
    updateEventDirectory: typeof actions.updateEntity;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

class EditEventDirectoryPage extends React.PureComponent<Props> {
  public state = {
    redirect: false,
    initialEventDirectory: {},
  };

  public handleSubmit = (
    data: EventDirectory,
    translations: TypedLooseObject<EventDirectoryTranslationFormProps>
  ) => {
    const { eventId } = this.props;
    this.props.actions.updateEventDirectory(
      this.props.mallId,
      eventId,
      data,
      translations
    );
  };

  public handleSuccess = () => {
    this.setState({
      redirect: true,
    });
    notification.success({
      message: 'Evento actualizada',
      description: 'Evento actualizada correctamente',
    });
  };

  public handleFailure = (error: any) => {
    const { intl } = this.props;
    const defaultMessage = 'Hubo un error al momento de editar el evento.';
    const content = buildErrorMessageContent(
      defaultMessage,
      error,
      intl,
      'event.label'
    );
    notification.error({
      message: 'Error',
      description: content,
    });
  };

  public render() {
    const { isLoading, mallId, eventId, timezone } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    return (
      <PageHeaderWrapper title={'Editar Evento'}>
        <Card>
          {this.state.redirect && <Redirect to={`${baseUrl}/events/list`} />}
          <Spin spinning={isLoading}>
            <ControlledEventDirectoryForm
              mallId={mallId}
              eventId={eventId}
              onSubmit={this.handleSubmit}
              onSuccess={this.handleSuccess}
              onFailure={this.handleFailure}
              timezone={timezone}
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
  const eventId = match.params.id;
  const mall = getMallById(state, state.malls.selectedMall || 0);
  const timezone = mall.timezone;
  return {
    eventId: Number(eventId),
    isLoading: state.events.isLoading,
    mallId: state.malls.selectedMall || 0,
    timezone,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { updateEntity, fetchEntity } = actions;
  return {
    actions: bindActionCreators(
      {
        updateEventDirectory: updateEntity,
        fetchEventDirectory: fetchEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditEventDirectoryPage);

export default withRouter(injectIntl(connectedComponent, { withRef: true }));
