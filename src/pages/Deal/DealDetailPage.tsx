import React from 'react';

import { Button, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import moment from 'moment';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { actions as dealActions } from 'src/actions/deal.action';
import { actions as mallActions } from 'src/actions/mall.action';
import ImageLightbox from 'src/components/ImageLightbox/ImageLightbox';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import {
  getDealById,
  getTranslatedDealById,
} from 'src/selectors/deal.selector';
import { getMallById } from 'src/selectors/mall.selector';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Deal } from 'src/types/response/Deal';
import { createMallDependentUrl } from 'src/utils';
import { EntityByIdActionCreator } from 'src/utils/basic-crud.action.types';
import {
  EventDirectoryState,
  stateTags,
} from 'src/utils/event-directory.utils';

interface StateProps {
  deal: Deal | null;
  dealId: number;
  mallId: number;
  currentLang: string;
  translations: TypedLooseObject<Deal>;
  timezone: string;
}

interface DispatchProps {
  actions: {
    fetchDeal: EntityByIdActionCreator;
    selectMall: typeof mallActions.selectMall;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

const defaultProps = { deal: undefined };
const dateFormat = 'YYYY-MM-DD';

class DealDetailPage extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;

  public componentDidMount = () => {
    const { actions, mallId, deal } = this.props;
    this.fetchDealData();
    if (deal && mallId !== deal.mallId) {
      actions.selectMall(deal.mallId);
    }
  };

  public fetchDealData = () => {
    const { actions, dealId, mallId } = this.props;
    actions.fetchDeal(mallId, dealId);
    languages.forEach((lang) => {
      actions.fetchDeal(mallId, dealId, lang);
    });
  };

  public componentDidUpdate(prevProps: Props) {
    const { mallId, dealId, deal, actions } = this.props;

    if (prevProps.dealId !== dealId) {
      this.fetchDealData();
    }
    if (deal && mallId !== deal.mallId) {
      actions.selectMall(deal.mallId);
      this.fetchDealData();
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

  public getTranslatedFields(deal: Deal): React.ReactNode {
    const { intl } = this.props;
    if (!deal) {
      return <></>;
    }
    return (
      <>
        {this.detailItem(
          intl.formatMessage(messages.deal.label.title),
          deal.title
        )}
        {this.detailItem(
          intl.formatMessage(messages.deal.label.description),
          deal.description
        )}
        {this.detailItem(
          intl.formatMessage(messages.deal.label.picture),
          deal.picture ? (
            <ImageLightbox images={[deal.picture ? deal.picture.url : '']} />
          ) : (
            intl.formatMessage(messages.event.label.emptyImage)
          )
        )}
      </>
    );
  }

  public formatDateString = (dateString: any) => {
    return moment(dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
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
    const { intl, deal, translations, match, mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    const dealId = deal ? deal.id : 0;
    const startDate =
      deal !== null ? moment(deal.displayStartDate, dateFormat) : moment();
    const endDate =
      deal !== null ? moment(deal.displayEndDate, dateFormat) : moment();
    return (
      <PageHeaderWrapper title={`Oferta: "${deal && deal.title}"`}>
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
                <PermissionCheck permission={[AppPermissions.deal.update]}>
                  <Link
                    to={{
                      pathname: `${baseUrl}/deals/${dealId}/edit`,
                      state: { returnUrl },
                    }}>
                    <Button type="primary">Editar</Button>
                  </Link>
                </PermissionCheck>
              </Col>
            </Row>
          </div>
          {deal && (
            <>
              {this.detailItem(
                intl.formatMessage(messages.deal.label.title),
                deal.title
              )}
              {this.detailItem(
                intl.formatMessage(messages.deal.label.description),
                deal.description
              )}
              {this.detailItem(
                intl.formatMessage(messages.deal.label.picture),
                deal.picture ? (
                  <ImageLightbox
                    images={[deal.picture ? deal.picture.url : '']}
                  />
                ) : (
                  intl.formatMessage(messages.event.label.emptyImage)
                )
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.state),
                this.checkEventState(startDate, endDate)
              )}
              {this.groupHeader(intl.formatMessage(messages.deal.label.date))}
              {this.detailItem(
                intl.formatMessage(messages.deal.label.startDate),
                this.formatDateTimeString(deal.startDate)
              )}
              {this.detailItem(
                intl.formatMessage(messages.event.label.endDate),
                this.formatDateTimeString(deal.endDate)
              )}
              {this.groupHeader(
                intl.formatMessage(messages.deal.label.announcementDate)
              )}
              {this.detailItem(
                intl.formatMessage(messages.deal.label.startDate),
                this.formatDateString(deal.displayStartDate)
              )}
              {this.detailItem(
                intl.formatMessage(messages.deal.label.endDate),
                this.formatDateString(deal.displayEndDate)
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
  const dealId = Number(props.match.params.id) || 0;
  const mallId = state.malls.selectedMall || 0;
  const deal = getDealById(state, `${dealId}`);
  const currentLang = state.locale.lang;
  const mall = getMallById(state, state.malls.selectedMall || 0);
  const timezone = mall.timezone;
  return {
    mallId,
    dealId,
    deal,
    currentLang,
    timezone,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tdeal = getTranslatedDealById(
            state,
            `${dealId}`,
            lang.toString()
          );
          return {
            ...acc,
            ...(tdeal && { [lang]: { ...tdeal } }),
          };
        },
        {} as TypedLooseObject<Deal>
      ),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchDeal: dealActions.fetchEntity,
        selectMall: mallActions.selectMall,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(DealDetailPage);
export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
