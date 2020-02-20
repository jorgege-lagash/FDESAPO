import { Button, Col, Form, Input, Row, Select, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, tailFormItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { PoiMallZone } from 'src/types/response/PoiMallZone';
// import { PoiType } from 'src/types/response/PoiType';
import { PoiMallZoneTranslationFormProps } from 'src/types/TranslationForm';
import { PoiMallZoneTranslationForm } from './PoiMallZoneTranslationForm';

const FormItem = Form.Item;

interface OwnState {
  translations: TypedLooseObject<PoiMallZoneTranslationFormProps>;
}

interface OwnProps {
  defaultData: PoiMallZone | null;
  // poiTypes: PoiType[];
  saveButtonText?: string;
  translations?: TypedLooseObject<PoiMallZone>;
  currentLang: string;
  onSubmit(
    data: PoiMallZone,
    translations: TypedLooseObject<PoiMallZoneTranslationFormProps>
  ): void;
}

const defaultProps = {
  saveButtonText: 'Guardar',
  // poiTypes: [],
};

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class PoiMallZoneForm extends React.PureComponent<Props, OwnState> {
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
          // acc[lang] = {
          //   name: { value: '' },
          // };
          return acc;
        },
        {} as TypedLooseObject<PoiMallZoneTranslationFormProps>
      );
    this.state.translations = translationDefaults;
  }
  public handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: PoiMallZone) => {
      if (!err) {
        this.props.onSubmit(
          {
            ...values,
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
    translations: TypedLooseObject<PoiMallZone>
  ) => {
    // const translationDefaults = Object.keys(translations).reduce(
    //   (acc, lang) => {
    //     const currTranslate = translations[lang] || {};
    //     return {
    //       ...acc,
    //       [lang]: {
    //         name: { value: currTranslate.name || '' },
    //       },
    //     };
    //   },
    //   { ...this.state.translations } as TypedLooseObject<
    //     PoiMallZoneTranslationFormProps
    //   >
    // );
    // this.setState({ translations: translationDefaults });
  };

  public updateFormValues = (poiMallZone: PoiMallZone) => {
    const { created, modified, ...data } = poiMallZone;
    const { form } = this.props;

    form.setFieldsValue({
      ...data,
    });
  };

  public handleTranslateChange = (
    data: PoiMallZoneTranslationFormProps,
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
    const { saveButtonText } = this.props;
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;
    const { translations } = this.state;
    return (
      <div>
        <Form>
          <h3>Información General</h3>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.poiMallZone.label.name)}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.poiMallZone.validation.name.required
                  ),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage(
                  messages.poiMallZone.placeholder.name
                )}
              />
            )}
          </FormItem>

          {/* <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.poiMallZone.label.poiType)}>
            {getFieldDecorator('poiTypeId', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.poiMallZone.validation.poiTypeId.required
                  ),
                },
              ],
            })(
              <Select
                placeholder={intl.formatMessage(
                  messages.poiMallZone.placeholder.poiType
                )}>
                {poiTypes.map((c) => (
                  <Select.Option key={`${c.id}`} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem> */}

          {/* <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.poiMallZone.label.urlLanding)}>
            {getFieldDecorator('urlLanding', {
              rules: [
                {
                  required: false,
                  type: 'url',
                  message: intl.formatMessage(
                    messages.poiMallZone.validation.urlLanding.required
                  ),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage(
                  messages.poiMallZone.placeholder.urlLanding
                )}
              />
            )}
          </FormItem> */}

          {/* <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.poiMallZone.label.icon)}>
            {getFieldDecorator('icon', {
              rules: [
                {
                  required: false,
                  message: intl.formatMessage(
                    messages.poiMallZone.validation.icon.required
                  ),
                },
              ],
            })}
          </FormItem> */}

          <FormItem {...tailFormItemLayout} />
        </Form>
        <Tabs tabPosition="top">
          {Object.keys(translations).map((lang) => {
            const translateData = translations[lang];
            return (
              <Tabs.TabPane tab={lang.toUpperCase()} key={lang}>
                <PoiMallZoneTranslationForm
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
      </div>
    );
  }
}

const WrappedPoiMallZoneForm = Form.create()(PoiMallZoneForm);

export default injectIntl(WrappedPoiMallZoneForm, {
  withRef: true,
});
