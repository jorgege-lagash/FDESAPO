import React from 'react';

import { Button, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import moment from 'moment';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { actions as eventActions } from 'src/actions/event-directory.action';
import { actions as mallActions } from 'src/actions/mall.action';
import ImageLightbox from 'src/components/ImageLightbox/ImageLightbox';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import {
  getEventDirectoryById,
  getTranslatedEventDirectoryById,
} from 'src/selectors/event-directory.selector';
import { getMallById } from 'src/selectors/mall.selector';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { createMallDependentUrl } from 'src/utils';
import { EntityByIdActionCreator } from 'src/utils/basic-crud.action.types';
import {
  EventDirectoryState,
  stateTags,
} from 'src/utils/event-directory.utils';
import { dateDisplayFormat, dateFormat } from 'src/utils/event-directory.utils';
interface StateProps {
  event: EventDirectory | null;
  eventId: number;
  mallId: number;
  currentLang: string;
  translations: TypedLooseObject<EventDirectory>;
  timezone: string;
}

interface DispatchProps {
  actions: {
    fetchEventDirectory: EntityByIdActionCreator;
    selectMall: typeof mallActions.selectMall;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

const defaultProps = { event: undefined };

class EventDirectoryDetailPage extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;

  public componentDidMount = () => {
    const { actions, mallId, event } = this.props;
    this.fetchEventDirectoryData();
    if (event && mallId !== event.mallId) {
      actions.selectMall(event.mallId);
    }
  };

  public fetchEventDirectoryData = () => {
    const { actions, eventId, mallId } = this.props;
    actions.fetchEventDirectory(mallId, eventId);
    languages.forEach((lang) => {
      actions.fetchEventDirectory(mallId, eventId, lang);
    });
  };

  public componentDidUpdate(prevProps: Props) {
    const { mallId, eventId, event, actions } = this.props;

    if (prevProps.eventId !== eventId) {
      this.fetchEventDirectoryData();
    }
    if (event && mallId !== event.mallId) {
      actions.selectMall(event.mallId);
      this.fetchEventDirectoryData();
    }
  }

  public groupHeader(label: string) {
    return <h3>{label}</h3>;
  }

  public detailItem(label: string, value: any) {
    return (
      <Row style={{ marginBottom: '16px' }} gutter={16}>
        <Col
          xs={{ offset: 0, span: 7 }}
          md={{ offset: 1, span: 3 }}
          style={{ fontWeight: 'bold', textAlign: 'left' }}>
          {label}:
        </Col>
        <Col span={9} xs={{ span: 17 }}>
          {value}
        </Col>
      </Row>
    );
  }

  public getTranslatedFields(event: EventDirectory): React.ReactNode {
    const { intl } = this.props;
    if (!event) {
      return <></>;
    }
    return (
      <>
        {this.detailItem(
          intl.formatMessage(messages.event.label.name),
          event.name
        )}
        {this.detailItem(
          intl.formatMessage(messages.event.label.description),
          event.description
        )}
        {this.detailItem(
          intl.formatMessage(messages.event.label.picture),
          event.picture ? (
            <ImageLightbox images={[event.picture ? event.picture.url : '']} />
          ) : (
            intl.formatMessage(messages.event.label.emptyImage)
          )
        )}
      </>
    );
  }

  public formatDateString = (dateString: any) => {
    return moment(dateString, dateFormat).format(dateDisplayFormat);
  };
  public formatDateTimeString = (date: any) => {
    const { timezone } = this.props;
    return moment(date)
      .tz(timezone)
      .format('DD-MM-YYYY HH:mm');
  };

  public checkEventState = (
    startDate: moment.Moment,
    endDate: moment.Moment
  ) => {
    const today = moment().startOf('day');
    if (startDate > today) {
      return stateTags[EventDirectoryState.scheduled];
    } else if (today > endDate) {
      return stateTags[EventDirectoryState.expired];
    } else if (today >= startDate && endDate >= today) {
      return stateTags[EventDirectoryState.published];
    }
    return '';
  };

  public render() {
    const { intl, event, translations, match, mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    const eventId = event ? event.id : 0;
    const startDate =
      event !== null ? moment(event.displayStartDate, dateFormat) : moment();
    const endDate =
      event !== null ? moment(event.displayEndDate, dateFormat) : moment();
    return (
      <PageHeaderWrapper title={`Evento: "${event && event.name}"`}>
        <Card>
          <br />
          <div className="gutter">
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <h2>Información general</h2>
              </Col>
              <Col
                className="gutter-row"
                style={{ textAlign: 'right' }}
                span={12}>
                <PermissionCheck permission={[AppPermissions.event.update]}>
                  <Link
                    to={{
                      pathname: `${baseUrl}/events/${eventId}/edit`,
                      state: { returnUrl },
                    }}>
                    <Button type="primary">Editar</Button>
                  </Link>
                </PermissionCheck>
              </Col>
            </Row>
          </div>
          {event && (
            <>
              {this.detailItem(
                intl.formatMessage(messages.event.label.name),
                event.name
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.description),
                event.description
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.picture),
                event.picture ? (
                  <ImageLightbox
                    images={[event.picture ? event.picture.url : '']}
                  />
                ) : (
                  intl.formatMessage(messages.event.label.emptyImage)
                )
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.state),
                this.checkEventState(startDate, endDate)
              )}
              {this.groupHeader(intl.formatMessage(messages.event.label.date))}
              {this.detailItem(
                intl.formatMessage(messages.event.label.startDate),
                this.formatDateTimeString(event.startDate)
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.endDate),
                this.formatDateTimeString(event.endDate)
              )}
              {this.groupHeader(
                intl.formatMessage(messages.event.label.announcementDate)
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.startDate),
                this.formatDateString(event.displayStartDate)
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.endDate),
                this.formatDateString(event.displayEndDate)
              )}
            </>
          )}
          <br />
          <Tabs defaultActiveKey="es" tabPosition="top">
            {Object.keys(translations).map((lang) => {
              return (
                <Tabs.TabPane tab={lang.toUpperCase()} key={lang}>
                  {this.getTranslatedFields(translations[lang])}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const eventId = Number(props.match.params.id) || 0;
  const mallId = state.malls.selectedMall || 0;
  const event = getEventDirectoryById(state, `${eventId}`);
  const currentLang = state.locale.lang;
  const mall = getMallById(state, state.malls.selectedMall || 0);
  const timezone = mall.timezone;
  return {
    mallId,
    eventId,
    event,
    currentLang,
    timezone,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tevent = getTranslatedEventDirectoryById(
            state,
            `${eventId}`,
            lang.toString()
          );
          return {
            ...acc,
            ...(tevent && { [lang]: { ...tevent } }),
          };
        },
        {} as TypedLooseObject<EventDirectory>
      ),
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

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDirectoryDetailPage);
export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
