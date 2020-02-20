import * as React from 'react';

import { Button, Col, Form, Input, InputNumber, Row, Select, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  formItemLayout,
  fullWidthItemLayout,
  tailFormItemLayout,
} from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { MallTranslationFormProps } from 'src/types/TranslationForm';
import { Mall } from '../../types/Mall';
import FormatedHtmlEditor from '../FormatedHtmlEditor/FormatedHtmlEditor';
import { MallTranslationForm } from '../MallTranslationFrom/MallTranslationFrom';

const Option = Select.Option;
const FormItem = Form.Item;

interface OwnState {
  translations: TypedLooseObject<MallTranslationFormProps>;
}

interface OwnProps {
  currentLang: string;
  translations?: TypedLooseObject<Mall>;
  defaultData: Mall;
  timeZones: string[];
  onSubmit(
    mall: Mall,
    translations: TypedLooseObject<MallTranslationFormProps>
  ): void;
}

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class UpdateMallForm extends React.Component<Props, OwnState> {
  public state: OwnState = {
    translations: {},
  };
  constructor(props: Props) {
    super(props);
    const translationDefaults = languages.reduce(
      (acc, lang) => {
        acc[lang] = {
          description: { value: '' },
          information: { value: '' },
        };
        return acc;
      },
      {} as TypedLooseObject<MallTranslationFormProps>
    );
    this.state.translations = translationDefaults;
  }

  public handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: Mall) => {
      if (!err) {
        this.props.onSubmit(values, this.state.translations);
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

  public updateTranslationState = (translations: TypedLooseObject<Mall>) => {
    const currentLang = this.props.currentLang;
    const translationDefaults = Object.keys(translations)
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const currTranslate = translations[lang] || {};
          return {
            ...acc,
            [lang]: {
              description: { value: currTranslate.description || '' },
              name: { value: currTranslate.name || '' },
              information: { value: currTranslate.information || '' },
            },
          };
        },
        { ...this.state.translations } as TypedLooseObject<
          MallTranslationFormProps
        >
      );
    this.setState({ translations: translationDefaults });
  };

  public updateFormValues(mall: Mall) {
    const { name, stringId, buildingId, description, information } = mall;
    this.props.form.setFieldsValue({
      name,
      stringId,
      buildingId,
      description,
      information,
    });
  }

  public handleTranslateChange = (
    data: MallTranslationFormProps,
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
    const { translations } = this.state;
    const {
      currentLang,
      form: { getFieldDecorator },
      timeZones,
      defaultData,
    } = this.props;
    const intl = this.props.intl;

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <h2>Editar Mall</h2>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.mall.label.name)}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.mall.validation.name.required
                  ),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage(messages.mall.placeholder.name)}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.mall.label.description)}>
            {getFieldDecorator('description', {
              rules: [],
            })(
              <Input
                placeholder={intl.formatMessage(
                  messages.mall.placeholder.description
                )}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.mall.label.buildingId)}>
            {getFieldDecorator('buildingId', {
              rules: [
                {
                  type: 'integer',
                  message: intl.formatMessage(
                    messages.mall.validation.buildingId.integer
                  ),
                },
              ],
            })(<InputNumber min={1} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.mall.label.stringId)}>
            {getFieldDecorator('stringId', {
              rules: [
                {
                  len: 3,
                  message: intl.formatMessage(
                    messages.mall.validation.stringId.length
                  ),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage(
                  messages.mall.placeholder.stringId
                )}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.mall.label.timezone)}>
            {getFieldDecorator('timezone', {
              initialValue: defaultData ? defaultData.timezone : '',
              rules: [],
            })(
              <Select
                placeholder={intl.formatMessage(messages.mall.label.timezone)}>
                {timeZones.map((timeZone) => (
                  <Option key={timeZone} value={timeZone}>
                    {timeZone}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...fullWidthItemLayout}
            label={intl.formatMessage(messages.mall.label.information)}>
            {getFieldDecorator('information', {
              rules: [],
            })(
              <FormatedHtmlEditor
                placeholder={intl.formatMessage(
                  messages.mall.label.information
                )}
              />
            )}
          </FormItem>
        </Form>
        <Tabs defaultActiveKey="en" tabPosition="top">
          {Object.keys(translations)
            .filter((l) => l !== currentLang)
            .map((lang) => {
              const translateData = translations[lang];
              return (
                <Tabs.TabPane tab={lang.toUpperCase()} key={lang}>
                  <MallTranslationForm
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
              {'Guardar'}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

const WrappedMallForm = Form.create()(UpdateMallForm);

export default injectIntl(WrappedMallForm, {
  withRef: true,
});
