import React from 'react';

import { Button, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { actions as mallActions } from 'src/actions/mall.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getMallById } from 'src/selectors/mall.selector';
import { getTranslatedMallById } from 'src/selectors/mall.selector';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Mall } from 'src/types/Mall';

interface StateProps {
  mallId: number;
  mall?: Mall;
  currentLang: string;
  translations: TypedLooseObject<Mall>;
}

interface DispatchProps {
  actions: {
    fetchMall: typeof mallActions.fetchMall;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

const defaultProps = { mall: undefined };

class MallDetailPage extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;

  public componentDidMount = () => {
    this.fetchData();
  };

  public fetchData = () => {
    const { actions, mallId } = this.props;
    actions.fetchMall(mallId);
    languages.forEach((lang) => {
      actions.fetchMall(mallId, lang);
    });
  };

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

  public getTranslatedFields(mall: Mall): React.ReactNode {
    const { intl } = this.props;
    if (!mall) {
      return <></>;
    }
    return (
      <>
        {this.detailItem(
          intl.formatMessage(messages.mall.label.description),
          mall.description
        )}

        {this.detailItem(
          intl.formatMessage(messages.mall.label.information),
          <p
            style={{ maxHeight: '500px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: mall.information || '' }}
          />
        )}
      </>
    );
  }
  public render() {
    const {
      mall,
      match: { params },
      intl,
      translations,
      match,
    } = this.props;

    const mallId = Number(params.id);
    const returnUrl = match.url;
    return (
      <PageHeaderWrapper title={`Mall "${mall && mall.name}"`}>
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
                <PermissionCheck permission={[AppPermissions.mall.update]}>
                  <Link
                    to={{
                      pathname: `/cms/malls/${mallId}/update`,
                      state: { returnUrl },
                    }}>
                    <Button type="primary">Editar</Button>
                  </Link>
                </PermissionCheck>
              </Col>
            </Row>
          </div>
          {mall && (
            <>
              {this.detailItem('Nombre', mall && mall.name)}
              {this.detailItem('Descripción', mall && mall.description)}
              {this.detailItem('Id de Edificio', mall && mall.buildingId)}
              {this.detailItem('Código de Mall', mall && mall.stringId)}
              {this.detailItem('Zona horaria', mall && mall.timezone)}
              {this.detailItem(
                intl.formatMessage(messages.mall.label.information),
                <p
                  style={{ maxHeight: '600px', overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: mall.information || '' }}
                />
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
  const mallId = Number(props.match.params.id);
  const currentLang = state.locale.lang;
  return {
    mallId,
    mall: getMallById(state, mallId),
    currentLang,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tdata = getTranslatedMallById(
            state,
            `${mallId}`,
            lang.toString()
          );
          return {
            ...acc,
            ...(tdata && { [lang]: { ...tdata } }),
          };
        },
        {} as TypedLooseObject<Mall>
      ),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchMall } = mallActions;
  return {
    actions: bindActionCreators(
      {
        fetchMall,
      },
      dispatch
    ),
  };
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MallDetailPage);

export default withRouter(injectIntl(ConnectedComponent, { withRef: true }));
