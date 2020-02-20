import React from 'react';

import { Button, Card, Col, Radio, Row, Spin, Tag } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { actions as categoryActions } from 'src/actions/category.action';
import { actions as channelActions } from 'src/actions/channel.action';
import { actions as dealActions } from 'src/actions/deal.action';
import { actions as maasActions } from 'src/actions/maas.action';
import { actions as mallActions } from 'src/actions/mall.action';
import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import { actions as poiActions } from 'src/actions/poi.action';
import { actions as tagActions } from 'src/actions/tag.action';
import { actions as travelerDiscountActions } from 'src/actions/traveler-discount.action';
import ImageLightbox from 'src/components/ImageLightbox/ImageLightbox';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import PoiStateTag from 'src/components/PoiStateTag/PoiStateTag';
import StateTag from 'src/components/StateTag/StateTag';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getDenormalizedCategories } from 'src/selectors/category.selector';
import { getChannelArrayById } from 'src/selectors/channel.selector';
import {
  getDealById,
  getTranslatedDealById,
} from 'src/selectors/deal.selector';
import {
  getDenormalizedPoi,
  getPoiById,
  getTranslatedPoiById,
} from 'src/selectors/poi.selector';
import { getDenormalizedPwPois } from 'src/selectors/pwpoi.selector';
import { getTagArrayById } from 'src/selectors/tag.selector';
import {
  getTranslatedTravelerDiscountById,
  getTravelerDiscountById,
} from 'src/selectors/traveler-discount.selector';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Category } from 'src/types/response/Category';
import { Channel } from 'src/types/response/Channel';
import { Deal } from 'src/types/response/Deal';
import { Poi } from 'src/types/response/POI';
import { PwPoi } from 'src/types/response/PwPoi';
import { Tag as ITag } from 'src/types/response/Tag';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import { parseObjectListIds } from 'src/utils';
import { createMallDependentUrl } from 'src/utils';

interface StateProps {
  poi: Poi | null;
  poiId: number;
  mallId: number;
  categories: Category[];
  tags: ITag[];
  channels: Channel[];
  pwPois: PwPoi[];
  currentLang: string;
  translations: TypedLooseObject<Poi>;
  isloadingPwpois: boolean;
  discountId: number;
  travelerDiscount: TravelerDiscount | null;
  dealId: number;
  deal: Deal | null;
  discountTranslations: TypedLooseObject<TravelerDiscount>;
  dealTranslations: TypedLooseObject<Deal>;
}

interface DispatchProps {
  actions: {
    fetchPoi: typeof poiActions.fetchPoi;
    selectMall: typeof mallActions.selectMall;
    fetchCategoryList: typeof categoryActions.fetchPagedEntityList;
    fetchPoiTypeList: typeof poiTypeActions.fetchEntityList;
    fetchPwPoiList: typeof maasActions.fetchPwPoiList;
    fetchChannelList: typeof channelActions.fetchChannelList;
    fetchTravelerDiscount: typeof travelerDiscountActions.fetchEntity;
    fetchAllTags: typeof tagActions.fetchAllPagedEntityList;
    fetchDeal: typeof dealActions.fetchEntity;
  };
}

interface States {
  currentLangDesc: string;
  travelerLang: string;
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

const defaultProps = { poi: undefined };
const defaultLang = 'es';

class PoiDetailPage extends React.Component<Props, States> {
  public static defaultProps = defaultProps;
  public state = {
    currentLangDesc: defaultLang,
    travelerLang: defaultLang,
  };

  public componentDidMount = () => {
    const { actions, mallId, poi } = this.props;
    this.fetchPoiData();
    this.fetchMallData(mallId);
    this.fetchDiscountData();
    this.fetchDealData();
    if (poi && mallId !== poi.mallId) {
      actions.selectMall(poi.mallId);
    }
  };

  public fetchPoiData = () => {
    const { actions, poiId, mallId } = this.props;
    actions.fetchPoi(mallId, poiId);
    languages.forEach((lang) => {
      actions.fetchPoi(mallId, poiId, lang);
    });
  };

  public fetchDiscountData = () => {
    const { actions, mallId, discountId } = this.props;
    actions.fetchTravelerDiscount(mallId, discountId);
    languages.forEach((lang) => {
      actions.fetchTravelerDiscount(mallId, discountId, lang);
    });
  };

  public fetchDealData = () => {
    const { actions, mallId, dealId } = this.props;
    actions.fetchDeal(mallId, dealId);
    languages.forEach((lang) => {
      actions.fetchDeal(mallId, dealId, lang);
    });
  };

  public fetchMallData(mallId: number) {
    const { actions } = this.props;
    actions.fetchCategoryList(mallId, 1, 1000);
    actions.fetchPoiTypeList(mallId);
    actions.fetchPwPoiList(mallId);
    actions.fetchChannelList(mallId, 1, 1000);
    actions.fetchAllTags(mallId, 1, 200);
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, poiId, poi, actions, discountId, dealId } = this.props;

    if (prevProps.mallId !== mallId) {
      actions.fetchCategoryList(mallId, 1, 1000);
    }
    if (prevProps.poiId !== poiId) {
      this.fetchPoiData();
    }
    if (poi && mallId !== poi.mallId) {
      actions.selectMall(poi.mallId);
      this.fetchMallData(poi.mallId);
    }
    if (discountId !== prevProps.discountId) {
      this.fetchDiscountData();
    }
    if (dealId !== prevProps.dealId) {
      this.fetchDealData();
    }
  }

  public detailItem(label: string, value: any) {
    return (
      <Row style={{ marginBottom: '16px' }} gutter={16}>
        <Col
          span={24}
          style={{ fontWeight: 'bold', opacity: 0.6, paddingBottom: '15px' }}>
          {label}:
        </Col>
        <Col span={24}>{value}</Col>
      </Row>
    );
  }

  public detailItem2Colums(label: string, value: any) {
    return (
      <Col span={12}>
        <h4
          style={{
            fontWeight: 'bold',
            opacity: 0.4,
            paddingBottom: '0px',
            color: '#000000',
          }}>
          {label}:
        </h4>
        {value}
      </Col>
    );
  }

  public getTranslatedFields(
    poi: Poi,
    discount: TravelerDiscount
  ): React.ReactNode {
    const { intl } = this.props;
    if (!poi) {
      return <></>;
    }
    return (
      <Row>
        {discount && (
          <>
            {this.detailItem2Colums(
              intl.formatMessage(messages.store.label.description),
              discount.description
            )}

            {this.detailItem2Colums(
              intl.formatMessage(messages.store.label.discountPicture),
              <span>
                <ImageLightbox
                  images={[discount.picture ? discount.picture.url : '']}
                />
              </span>
            )}
          </>
        )}
      </Row>
    );
  }

  public handleClickDesc = (e: any) => {
    this.setState({ currentLangDesc: e.target.value });
  };

  public handleClickTravelerLang = (e: any) => {
    this.setState({ travelerLang: e.target.value });
  };

  public getColumn2() {
    const { intl, poi, channels, tags, pwPois, isloadingPwpois } = this.props;
    if (!poi) {
      return <></>;
    }
    return (
      <>
        <Row style={{ marginBottom: '15px' }} gutter={16}>
          {this.detailItem2Colums(
            intl.formatMessage(messages.store.label.poiType),
            <Tag color="blue">{poi.poiType ? poi.poiType.name : ''}</Tag>
          )}
          {this.detailItem2Colums(
            intl.formatMessage(messages.store.label.state),
            <PoiStateTag poiState={poi.poiState} />
          )}
        </Row>
        <Row style={{ marginBottom: '15px' }} gutter={16}>
          {this.detailItem2Colums(
            intl.formatMessage(messages.store.label.floor),
            poi.floor
          )}
          {this.detailItem2Colums(
            intl.formatMessage(messages.store.label.suc),
            poi.suc
          )}
        </Row>
        {this.detailItem(
          intl.formatMessage(messages.store.label.poisPhunware),
          <>
            {pwPois &&
              pwPois
                .filter((c) => c)
                .map((c) => <Tag key={c.id}>{c.name}</Tag>)}
            <Spin spinning={isloadingPwpois} style={{ width: '128px' }} />
          </>
        )}

        {this.detailItem(
          intl.formatMessage(messages.store.label.screenshot),
          <span>
            {poi.screenshot && poi.screenshot.url ? (
              <ImageLightbox
                images={[poi.screenshot ? poi.screenshot.url : '']}
              />
            ) : (
              'No se ha generado imagen'
            )}
          </span>
        )}
        {this.detailItem(
          intl.formatMessage(messages.store.label.tags),
          tags &&
            tags.filter((c) => c).map((c) => <Tag key={c.id}>{c.name}</Tag>)
        )}
        <Row style={{ marginBottom: '15px' }} gutter={16}>
          {this.detailItem2Colums(
            intl.formatMessage(messages.store.label.hasTouristDiscount),
            <StateTag active={poi.hasTouristDiscount || false} />
          )}
          {this.detailItem2Colums(
            intl.formatMessage(messages.store.label.channels),
            channels &&
              channels
                .filter((c) => c)
                .map((c) => c.name)
                .join(', ')
          )}
        </Row>
      </>
    );
  }

  public render() {
    const { intl, poi, categories, match, mallId, translations } = this.props;
    const { currentLangDesc } = this.state;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    const poiId = poi ? poi.id : 0;
    return (
      <PageHeaderWrapper title={`POI: "${poi && poi.name}"`}>
        <Card>
          {poi && (
            <div className="gutter">
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <h2>Información general</h2>
                </Col>
                <Col
                  className="gutter-row"
                  style={{ textAlign: 'right' }}
                  span={12}>
                  <PermissionCheck permission={[AppPermissions.poi.update]}>
                    <Link
                      to={{
                        pathname: `${baseUrl}/pois/${poiId}/edit`,
                        state: { returnUrl },
                      }}>
                      <Button type="primary">Editar</Button>
                    </Link>
                  </PermissionCheck>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" xs={24} md={12}>
                  <Row type="flex" gutter={16} align="bottom">
                    <Col className="gutter-row" span={6}>
                      <span>
                        <ImageLightbox
                          images={[poi.logo ? poi.logo.url : '']}
                        />
                      </span>
                    </Col>
                    <Col className="gutter-row" span={18}>
                      <h2 style={{ paddingLeft: '25px', marginBottom: '5px' }}>
                        {poi.name}
                      </h2>
                    </Col>
                  </Row>
                  <br />
                  {this.detailItem(
                    intl.formatMessage(messages.store.label.categories),
                    categories &&
                      categories
                        .filter((c) => c)
                        .map((c) => <Tag key={c.id}>{c.name}</Tag>)
                  )}
                  <Row style={{ marginBottom: '25px' }} gutter={16}>
                    <Col
                      span={12}
                      style={{
                        fontWeight: 'bold',
                        opacity: 0.6,
                        paddingBottom: '12px',
                      }}>
                      {intl.formatMessage(messages.store.label.description)}:
                    </Col>
                    <Col
                      span={12}
                      style={{ opacity: 0.6, paddingBottom: '12px' }}>
                      <Radio.Group
                        defaultValue={defaultLang}
                        size="small"
                        onChange={this.handleClickDesc}>
                        <Radio.Button value={defaultLang}>ES</Radio.Button>
                        {Object.keys(translations).map((language) => {
                          return (
                            <Radio.Button key={language} value={language}>
                              {language.toUpperCase()}
                            </Radio.Button>
                          );
                        })}
                      </Radio.Group>
                    </Col>
                    <Col span={24}>
                      {currentLangDesc === defaultLang
                        ? poi.description
                        : translations[currentLangDesc].description}
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: '15px' }} gutter={16}>
                    {this.detailItem2Colums(
                      intl.formatMessage(messages.store.label.website),
                      poi.website
                    )}
                    {this.detailItem2Colums(
                      intl.formatMessage(messages.store.label.facebook),
                      poi.facebook
                    )}
                  </Row>
                  <Row style={{ marginBottom: '15px' }} gutter={16}>
                    {this.detailItem2Colums(
                      intl.formatMessage(messages.store.label.instagram),
                      poi.instagram
                    )}
                    {this.detailItem2Colums(
                      intl.formatMessage(messages.store.label.telephone),
                      poi.telephone
                    )}
                  </Row>
                </Col>
                <Col className="gutter-row" xs={24} md={12}>
                  {this.getColumn2()}
                </Col>
              </Row>
            </div>
          )}
        </Card>
        {this.travelerData()}
      </PageHeaderWrapper>
    );
  }

  public travelerData = () => {
    const {
      poi,
      translations,
      travelerDiscount,
      discountTranslations,
    } = this.props;
    const { travelerLang } = this.state;
    if (!poi || !travelerDiscount || !poi.hasTouristDiscount) {
      return '';
    }
    return (
      <Card style={{ marginTop: '20px' }}>
        <Row gutter={16}>
          <Col className="gutter-row" span={16}>
            <h3>Descuento de turista</h3>
          </Col>
          <Col className="gutter-row" span={8}>
            <Radio.Group
              defaultValue={defaultLang}
              size="small"
              onChange={this.handleClickTravelerLang}>
              <Radio.Button value={defaultLang}>ES</Radio.Button>
              {Object.keys(translations).map((lang) => {
                return (
                  <Radio.Button key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </Col>
        </Row>
        {travelerLang === defaultLang
          ? this.translatedTravelerFields(
              travelerDiscount,
              poi.hasTouristDiscount
            )
          : this.getTranslatedFields(
              translations[travelerLang],
              discountTranslations[travelerLang]
            )}
      </Card>
    );
  };

  private translatedTravelerFields(
    travelerDiscount?: TravelerDiscount | null,
    hasTouristDiscount: boolean = false
  ) {
    const { intl } = this.props;
    return (
      <Row>
        {travelerDiscount && hasTouristDiscount && (
          <>
            <Col span={12}>
              <h4
                style={{
                  fontWeight: 'bold',
                  opacity: 0.4,
                  paddingBottom: '0px',
                  color: '#000000',
                }}>
                {intl.formatMessage(messages.store.label.discount)}:
              </h4>
              {travelerDiscount.discount}
              <h4
                style={{
                  fontWeight: 'bold',
                  opacity: 0.4,
                  paddingBottom: '0px',
                  color: '#000000',
                }}>
                {intl.formatMessage(messages.store.label.description)}:
              </h4>
              {travelerDiscount.description}
            </Col>
            <Col span={12}>
              {this.detailItem2Colums(
                intl.formatMessage(messages.store.label.discountPicture),
                <span>
                  <ImageLightbox
                    images={[
                      travelerDiscount.picture
                        ? travelerDiscount.picture.url
                        : '',
                    ]}
                  />
                </span>
              )}
            </Col>
          </>
        )}
      </Row>
    );
  }
}

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const poiId = Number(props.match.params.id);
  const mallId = state.malls.selectedMall || 0;
  let poi = getPoiById(state, `${poiId}`);
  if (poi) {
    poi = getDenormalizedPoi(state, poiId);
  }
  const categoryIds = parseObjectListIds(poi && poi.categories);
  const channelIds = parseObjectListIds(poi && poi.channels);
  const pwpoiIds = parseObjectListIds(poi && poi.poisPhunware);
  const categories = getDenormalizedCategories(state, categoryIds);
  const pwPois = getDenormalizedPwPois(state, pwpoiIds);
  const channels = getChannelArrayById(state, channelIds);
  const currentLang = state.locale.lang;

  const discountId = poi
    ? parseObjectListIds(poi.travelerDiscounts)[0] || 0
    : 0;
  const travelerDiscount = getTravelerDiscountById(state, discountId);
  const dealId = poi ? parseObjectListIds(poi.deals)[0] || 0 : 0;
  const deal = getDealById(state, dealId);
  const tags = poi ? getTagArrayById(state, parseObjectListIds(poi.tags)) : [];
  return {
    mallId,
    poiId,
    poi,
    discountId,
    travelerDiscount,
    dealId,
    deal,
    tags,
    categories,
    pwPois,
    channels,
    currentLang,
    isloadingPwpois: state.pwpois.isLoading,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tpoi = getTranslatedPoiById(state, `${poiId}`, lang.toString());
          return {
            ...acc,
            ...(tpoi && { [lang]: { ...tpoi } }),
          };
        },
        {} as TypedLooseObject<Poi>
      ),
    discountTranslations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tdiscount = getTranslatedTravelerDiscountById(
            state,
            discountId,
            lang
          );
          return {
            ...acc,
            ...(tdiscount && { [lang]: { ...tdiscount } }),
          };
        },
        {} as TypedLooseObject<TravelerDiscount>
      ),
    dealTranslations: languages
      .filter((l) => l !== currentLang)
      .reduce<TypedLooseObject<Deal>>((acc, lang) => {
        const tdeal = getTranslatedDealById(state, dealId, lang);
        return {
          ...acc,
          ...(tdeal && { [lang]: { ...tdeal } }),
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
        selectMall: mallActions.selectMall,
        fetchCategoryList: categoryActions.fetchPagedEntityList,
        fetchPoiTypeList: poiTypeActions.fetchEntityList,
        fetchPwPoiList: maasActions.fetchPwPoiList,
        fetchChannelList: channelActions.fetchChannelList,
        fetchTravelerDiscount: travelerDiscountActions.fetchEntity,
        fetchAllTags: tagActions.fetchAllPagedEntityList,
        fetchDeal: dealActions.fetchEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PoiDetailPage);
export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
