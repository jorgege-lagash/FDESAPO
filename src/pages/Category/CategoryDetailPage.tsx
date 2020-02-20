import React from 'react';

import { Button, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { actions as categoryActions } from 'src/actions/category.action';
import { actions as mallActions } from 'src/actions/mall.action';
import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import {
  getCategoryById,
  getTranslatedCategoryById,
} from 'src/selectors/category.selector';
import { getPoiTypeById } from 'src/selectors/poi-type.selector';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Category } from 'src/types/response/Category';
import { PoiType } from 'src/types/response/PoiType';
import { createMallDependentUrl } from 'src/utils';
import { EntityByIdActionCreator } from 'src/utils/basic-crud.action.types';
import CategoryIcon from 'src/components/CategoryForm/CategoryIcon';

interface StateProps {
  category: Category | null;
  categoryId: number;
  poiType: PoiType | null;
  mallId: number;
  currentLang: string;
  translations: TypedLooseObject<Category>;
}

interface DispatchProps {
  actions: {
    fetchCategory: EntityByIdActionCreator;
    selectMall: typeof mallActions.selectMall;
    fetchPoiType: EntityByIdActionCreator;
  };
}

type Props = StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }> &
  InjectedIntlProps;

const defaultProps = { category: undefined };

class CategoryDetailPage extends React.PureComponent<Props> {
  public static defaultProps = defaultProps;

  public componentDidMount = () => {
    const { actions, mallId, category } = this.props;
    this.fetchCategoryData();
    if (category && mallId !== category.mallId) {
      actions.selectMall(category.mallId);
    }
    if (category) {
      this.props.actions.fetchPoiType(mallId, category.poiTypeId);
    }
  };

  public fetchCategoryData = () => {
    const { actions, categoryId, mallId } = this.props;
    actions.fetchCategory(mallId, categoryId);
    languages.forEach((lang) => {
      actions.fetchCategory(mallId, categoryId, lang);
    });
  };

  public componentDidUpdate(prevProps: Props) {
    const { mallId, categoryId, category, actions } = this.props;

    if (prevProps.categoryId !== categoryId) {
      this.fetchCategoryData();
    }
    if (category && mallId !== category.mallId) {
      actions.selectMall(category.mallId);
      this.fetchCategoryData();
    }
    if (category && category !== prevProps.category) {
      this.props.actions.fetchPoiType(mallId, category.poiTypeId);
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

  public getTranslatedFields(category: Category): React.ReactNode {
    const { intl } = this.props;
    if (!category) {
      return <></>;
    }
    return (
      <>
        {this.detailItem(
          intl.formatMessage(messages.category.label.name),
          category.name
        )}
      </>
    );
  }

  public render() {
    const { intl, category, translations, poiType, match, mallId } = this.props;
    const baseUrl = createMallDependentUrl(mallId, '');
    const returnUrl = match.url;
    const categoryId = category ? category.id : 0;
    return (
      <PageHeaderWrapper title={`Categoria: "${category && category.name}"`}>
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
                <PermissionCheck permission={[AppPermissions.category.update]}>
                  <Link
                    to={{
                      pathname: `${baseUrl}/categories/${categoryId}/edit`,
                      state: { returnUrl },
                    }}>
                    <Button type="primary">Editar</Button>
                  </Link>
                </PermissionCheck>
              </Col>
            </Row>
          </div>
          {
            <>
              {this.detailItem(
                intl.formatMessage(messages.category.label.name),
                category && category.name
              )}
              {this.detailItem(
                intl.formatMessage(messages.category.label.poiType),
                poiType && poiType.name
              )}
              {this.detailItem(
                intl.formatMessage(messages.category.label.icon),
                category && <CategoryIcon iconName={category.icon} />
              )}
              {this.detailItem(
                intl.formatMessage(messages.category.label.urlLanding),
                category && category.urlLanding
              )}
            </>
          }
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
  const categoryId = Number(props.match.params.id) || 0;
  const mallId = state.malls.selectedMall || 0;
  const category = getCategoryById(state, `${categoryId}`);
  const poiType = category && getPoiTypeById(state, category.poiTypeId);
  const currentLang = state.locale.lang;
  return {
    mallId,
    categoryId,
    category,
    poiType,
    currentLang,
    translations: languages
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const tcategory = getTranslatedCategoryById(
            state,
            `${categoryId}`,
            lang.toString()
          );
          return {
            ...acc,
            ...(tcategory && { [lang]: { ...tcategory } }),
          };
        },
        {} as TypedLooseObject<Category>
      ),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchCategory: categoryActions.fetchEntity,
        selectMall: mallActions.selectMall,
        fetchPoiType: poiTypeActions.fetchEntity,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryDetailPage);
export default withRouter(
  injectIntl(connectedComponent, {
    withRef: true,
  })
);
