import * as React from 'react';

import { Button, Col, Form, Input, InputNumber, Row, Select, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Moment } from 'moment';
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
import { cleanTranslation } from 'src/utils';
import { Mall } from '../../types/Mall';
import FormatedHtmlEditor from '../FormatedHtmlEditor/FormatedHtmlEditor';
import { MallTranslationForm } from '../MallTranslationFrom/MallTranslationFrom';

const FormItem = Form.Item;
const Option = Select.Option;

interface OwnState {
  translations: TypedLooseObject<MallTranslationFormProps>;
}

interface OwnProps {
  currentLang: string;
  timeZones: string[];
  onSubmit(
    mall: Mall,
    translation: TypedLooseObject<MallTranslationFormProps>
  ): void;
}

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class CreateMallForm extends React.Component<Props, OwnState> {
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
    const { currentLang } = this.props;
    this.props.form.validateFields((err: any, values: Mall) => {
      if (!err) {
        this.props.onSubmit(
          values,
          cleanTranslation(this.state.translations, currentLang)
        );
      }
      return false;
    });
  };

  public scheduleValidator = (
    rule: any,
    value: Moment[] | undefined,
    callback: (message?: string) => void
  ) => {
    if (value && (!value[0] || !value[1])) {
      callback('Debe seleccionar hora de inicio y fin!');
    } else {
      callback();
    }
  };

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
      intl,
      form: { getFieldDecorator },
      currentLang,
      timeZones,
    } = this.props;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <h3>Información General</h3>

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
                  required: true,
                  message: intl.formatMessage(
                    messages.mall.validation.buildingId.required
                  ),
                },
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
                  required: true,
                  message: intl.formatMessage(
                    messages.mall.validation.stringId.required
                  ),
                },
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
              rules: [],
              initialValue: 'America/Santiago',
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
              initialValue: '',
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

const WrappedMallForm = Form.create()(CreateMallForm);

export default injectIntl(WrappedMallForm, {
  withRef: true,
});
