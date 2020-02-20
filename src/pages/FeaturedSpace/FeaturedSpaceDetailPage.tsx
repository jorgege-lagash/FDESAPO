import React from 'react';

import { Button, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { actions as featuredSpaceActions } from 'src/actions/featured-space.action';
import { actions as mallActions } from 'src/actions/mall.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import StateTag from 'src/components/StateTag/StateTag';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import {
  getFeaturedSpaceById,
  getTranslatedFeaturedSpaceById,
} from 'src/selectors/featured-space.selector';
import messages from 'src/translations/default/messages';
import { Language, languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { excludeVal } from 'src/utils';
import { createMallDependentUrl } from 'src/utils';
import { EntityByIdActionCreator } from 'src/utils/basic-crud.action.types';

interface StateProps {
  featuredSpace: FeaturedSpace | null;
  featuredSpaceId: number;
  mallId: number;
  currentLang: string;
  translations: TypedLooseObject<FeaturedSpace>;
}

interface DispatchProps {
  actions: {
    fetchFeaturedSpace: EntityByIdActionCreator;
    selectMall: typeof mallActions.selectMall;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

const defaultProps = { featuredSpace: undefined };

class FeaturedSpaceDetailPage extends React.Component<Props> {
  public static defaultProps = defaultProps;

  public componentDidMount = () => {
    const { actions, mallId, featuredSpace } = this.props;
    this.fetchFeaturedSpaceData();
    if (featuredSpace && mallId !== featuredSpace.mallId) {
      actions.selectMall(featuredSpace.mallId);
    }
  };

  public fetchFeaturedSpaceData = () => {
    const { actions, featuredSpaceId, mallId, currentLang } = this.props;
    actions.fetchFeaturedSpace(mallId, featuredSpaceId);
    excludeVal<Language>(languages, currentLang as Language).forEach((lang) => {
      actions.fetchFeaturedSpace(mallId, featuredSpaceId, lang);
    });
  };

  public componentDidUpdate(prevProps: Props) {
    const { mallId, featuredSpaceId, featuredSpace, actions } = this.props;

    if (prevProps.featuredSpaceId !== featuredSpaceId) {
      this.fetchFeaturedSpaceData();
    }
    if (featuredSpace && mallId !== featuredSpace.mallId) {
      actions.selectMall(featuredSpace.mallId);
      this.fetchFeaturedSpaceData();
    }
  }

  public detailItem(label: string, value: any) {
    return (
      <Row style={{ marginBottom: '16px' }} gutter={16}>
        <Col
          xs={{ offset: 0, span: 7 }}
          md={{ offset: 0, span: 4 }}
          style={{ fontWeight: 'bold', textAlign: 'end' }}>
          {label}:
        </Col>
        <Col span={8} xs={{ span: 17 }}>
          {value}
        </Col>
      </Row>
    );
  }

  public getTranslatedFields(featuredSpace: FeaturedSpace): React.ReactNode {
    const { intl } = this.props;
    if (!featuredSpace) {
      return <></>;
    }
    return (
      <div>
        {this.detailItem(
          intl.formatMessage(messages.store.label.logo),
          <span>
            <img
              src={featuredSpace.picture ? featuredSpace.picture.url : ''}
              style={{ maxWidth: '50%' }}
            />
          </span>
        )}
      </div>
    );
  }

  public render() {
    const { intl, featuredSpace, translations, match, mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    const featuredSpaceId = featuredSpace ? featuredSpace.id : 0;

    return (
      <PageHeaderWrapper
        title={`Espacio publicitario: "${featuredSpace &&
          featuredSpace.name}"`}>
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
                <PermissionCheck
                  permission={[AppPermissions.featuredSpace.update]}>
                  <Link
                    to={{
                      pathname: `${baseUrl}/featured-space/${featuredSpaceId}/edit`,
                      state: { returnUrl },
                    }}>
                    <Button type="primary">Editar</Button>
                  </Link>
                </PermissionCheck>
              </Col>
            </Row>
          </div>
          {featuredSpace && (
            <>
              {this.detailItem(
                intl.formatMessage(messages.featuredSpace.label.name),
                featuredSpace.name
              )}
              {this.detailItem(
                intl.formatMessage(
                  messages.featuredSpace.label.featureSpaceType
                ),
                featuredSpace.featureSpaceType
                  ? featuredSpace.featureSpaceType.name
                  : ''
              )}
              {this.detailItem(
                intl.formatMessage(messages.featuredSpace.label.state),
                <StateTag active={featuredSpace.active} />
              )}
              {this.detailItem(
                intl.formatMessage(messages.store.label.logo),
                <span>
                  <img
                    src={featuredSpace.picture ? featuredSpace.picture.url : ''}
                    style={{ maxWidth: '50%' }}
                  />
                </span>
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
  const featuredSpaceId = Number(props.match.params.id) || 0;
  const mallId = state.malls.selectedMall || 0;
  const featuredSpace = getFeaturedSpaceById(state, `${featuredSpaceId}`);

  const currentLang = state.locale.lang;
  return {
    mallId,
    featuredSpaceId,
    featuredSpace,
    currentLang,
    translations: excludeVal<Language>(
      languages,
      currentLang as Language
    ).reduce(
      (acc, lang) => {
        const tfeaturedSpace = getTranslatedFeaturedSpaceById(
          state,
          `${featuredSpaceId}`,
          lang.toString()
        );
        return {
          ...acc,
          ...(tfeaturedSpace && { [lang]: { ...tfeaturedSpace } }),
        };
      },
      {} as TypedLooseObject<FeaturedSpace>
    ),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchFeaturedSpace: featuredSpaceActions.fetchEntity,
        selectMall: mallActions.selectMall,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(FeaturedSpaceDetailPage);
export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
