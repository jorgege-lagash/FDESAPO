import { Button, Col, Form, Input, Row, Select, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, tailFormItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Category } from 'src/types/response/Category';
import { PoiType } from 'src/types/response/PoiType';
import { CategoryTranslationFormProps } from 'src/types/TranslationForm';
import { CategoryTranslationForm } from './CategoryTranslationForm';
import CategoryIcons from './CategoryIcons';

const FormItem = Form.Item;

interface OwnState {
  translations: TypedLooseObject<CategoryTranslationFormProps>;
}

interface OwnProps {
  defaultData: Category | null;
  poiTypes: PoiType[];
  saveButtonText?: string;
  translations?: TypedLooseObject<Category>;
  currentLang: string;
  onSubmit(
    data: Category,
    translations: TypedLooseObject<CategoryTranslationFormProps>
  ): void;
}

const defaultProps = {
  saveButtonText: 'Guardar',
  poiTypes: [],
};

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class CategoryForm extends React.PureComponent<Props, OwnState> {
  public static defaultProps = defaultProps;
  public state: OwnState = {
    translations: {},
  };
  constructor(props: Props) {
    super(props);
    const translationDefaults = languages
      .filter((l) => l !== props.currentLang)
      .reduce(
        (acc, lang) => {
          acc[lang] = {
            name: { value: '' },
          };
          return acc;
        },
        {} as TypedLooseObject<CategoryTranslationFormProps>
      );
    this.state.translations = translationDefaults;
  }
  public handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: Category) => {
      if (!err) {
        this.props.onSubmit(
          {
            ...values,
            icon: !values.icon ? 'iconAccelerator' : values.icon,
          },
          this.state.translations
        );
      }
      return false;
    });
  };

  public componentDidMount() {
    if (this.props.defaultData) {
      this.updateFormValues(this.props.defaultData);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { defaultData, translations } = this.props;
    if (defaultData && prevProps.defaultData !== defaultData) {
      this.updateFormValues(defaultData);
    }

    if (translations && translations !== prevProps.translations) {
      this.updateTranslationState(translations);
    }
  }
  public updateTranslationState = (
    translations: TypedLooseObject<Category>
  ) => {
    const translationDefaults = Object.keys(translations).reduce(
      (acc, lang) => {
        const currTranslate = translations[lang] || {};
        return {
          ...acc,
          [lang]: {
            name: { value: currTranslate.name || '' },
          },
        };
      },
      { ...this.state.translations } as TypedLooseObject<
        CategoryTranslationFormProps
      >
    );
    this.setState({ translations: translationDefaults });
  };

  public updateFormValues = (category: Category) => {
    const { created, modified, ...data } = category;
    const { form } = this.props;

    form.setFieldsValue({
      ...data,
    });
  };

  public handleTranslateChange = (
    data: CategoryTranslationFormProps,
    lang: string
  ) => {
    const { translations } = this.state;
    this.setState({
      translations: {
        ...translations,
        [lang]: {
          ...translations[lang],
          ...data,
        },
      },
    });
  };

  public render() {
    const { saveButtonText, poiTypes } = this.props;
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;
    const { translations } = this.state;
    return (
      <>
        <Form>
          <h3>Información General</h3>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.category.label.name)}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.category.validation.name.required
                  ),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage(
                  messages.category.placeholder.name
                )}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.category.label.poiType)}>
            {getFieldDecorator('poiTypeId', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.category.validation.poiTypeId.required
                  ),
                },
              ],
            })(
              <Select
                placeholder={intl.formatMessage(
                  messages.category.placeholder.poiType
                )}>
                {poiTypes.map((c) => (
                  <Select.Option key={`${c.id}`} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.category.label.urlLanding)}>
            {getFieldDecorator('urlLanding', {
              rules: [
                {
                  required: false,
                  type: 'url',
                  message: intl.formatMessage(
                    messages.category.validation.urlLanding.required
                  ),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage(
                  messages.category.placeholder.urlLanding
                )}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.category.label.icon)}>
            {getFieldDecorator('icon', {
              rules: [
                {
                  required: false,
                  message: intl.formatMessage(
                    messages.category.validation.icon.required
                  ),
                },
              ],
            })(<CategoryIcons />)}
          </FormItem>

          <FormItem {...tailFormItemLayout} />
        </Form>
        <Tabs tabPosition="top">
          {Object.keys(translations).map((lang) => {
            const translateData = translations[lang];
            return (
              <Tabs.TabPane tab={lang.toUpperCase()} key={lang}>
                <CategoryTranslationForm
                  {...translateData}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={(data: any) =>
                    this.handleTranslateChange(data, lang)
                  }
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        <Row>
          <Col {...tailFormItemLayout.wrapperCol}>
            <Button type="primary" onClick={this.handleSubmit}>
              {saveButtonText}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

const WrappedCategoryForm = Form.create()(CategoryForm);

export default injectIntl(WrappedCategoryForm, {
  withRef: true,
});
