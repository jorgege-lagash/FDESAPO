import { Button, Col, Form, Input, Row, Select, Switch, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, tailFormItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FeatureSpaceType } from 'src/types/response/FeatureSpaceType';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';
import { ImageInput } from '../ImageInput/ImageInput';
import { FeaturedSpaceTranslationForm } from './FeaturedSpaceTranslationForm';

const FormItem = Form.Item;

interface OwnState {
  translations: TypedLooseObject<FeaturedSpaceTranslationFormProps>;
}

interface OwnProps {
  defaultData: FeaturedSpace | null;
  saveButtonText?: string;
  translations?: TypedLooseObject<FeaturedSpace>;
  currentLang: string;
  featureSpaceTypes: FeatureSpaceType[];
  onSubmit(
    data: FeaturedSpace,
    translations: TypedLooseObject<FeaturedSpaceTranslationFormProps>
  ): void;
}

const defaultProps = {
  saveButtonText: 'Guardar',
  poiTypes: [],
};

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class FeaturedSpaceForm extends React.Component<Props, OwnState> {
  public static defaultProps = defaultProps;

  public state: OwnState = {
    translations: {},
  };

  public translationforms: Array<React.ReactElement<any>> = [];

  constructor(props: Props) {
    super(props);
    const translationDefaults = languages
      .filter((l) => l !== props.currentLang)
      .reduce(
        (acc, lang) => {
          acc[lang] = {
            pictureFile: { url: '', value: null },
          };
          return acc;
        },
        {} as TypedLooseObject<FeaturedSpaceTranslationFormProps>
      );
    this.state.translations = translationDefaults;
  }
  public handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const forms = this.translationforms.map((tform) => tform.props.form);
    forms.push(this.props.form);
    const validationPromises = forms.map(
      (tform) =>
        new Promise((resolve, reject) => {
          tform.validateFieldsAndScroll((err: any, values: FeaturedSpace) => {
            if (err) {
              reject(err);
              return false;
            }
            resolve(values);
            return true;
          });
        })
    );
    Promise.all(validationPromises).then((data: FeaturedSpace[]) => {
      const values: any = this.props.form.getFieldsValue();
      this.props.onSubmit(values, this.state.translations);
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
    translations: TypedLooseObject<FeaturedSpace>
  ) => {
    const translationDefaults = Object.keys(translations).reduce(
      (acc, lang) => {
        const currTranslate = translations[lang] || {};
        const pictureFile = currTranslate.pictureFile || null;
        const url = this.getURLFromData(currTranslate);
        return {
          ...acc,
          [lang]: {
            pictureFile: { url, value: pictureFile },
          },
        };
      },
      { ...this.state.translations } as TypedLooseObject<
        FeaturedSpaceTranslationFormProps
      >
    );
    this.setState({ translations: translationDefaults });
  };

  public updateFormValues = (featuredSpace: FeaturedSpace) => {
    const { created, modified, featureSpaceType, ...data } = featuredSpace;
    const { form } = this.props;
    if (featureSpaceType) {
      data.featureSpaceTypeId = featureSpaceType.id;
    }
    form.setFieldsValue({
      ...data,
    });
  };

  public handleTranslateChange = (
    data: FeaturedSpaceTranslationFormProps,
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

  public setTranslationFormRef = (index: number) => (
    r: React.ReactElement<any>
  ) => {
    this.translationforms[index] = r;
  };

  public handleTranslationFormChange = (lang: string) => (data: any) =>
    this.handleTranslateChange(data, lang);

  public getURLFromData = (data?: Partial<FeaturedSpace> | null) => {
    if (!data || !data.picture) {
      return '';
    }
    return data.picture.url;
  };

  public render() {
    const { saveButtonText, defaultData, featureSpaceTypes } = this.props;
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;
    const { translations } = this.state;
    const dimesion = { width: 1000, height: 304 };
    const maxSize = 2;
    return (
      <>
        <Form>
          <h3>Información General</h3>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.featuredSpace.label.name)}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.validation.required),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(
              messages.featuredSpace.label.featureSpaceType
            )}>
            {getFieldDecorator('featureSpaceTypeId', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.validation.required),
                },
              ],
            })(
              <Select
                placeholder={intl.formatMessage(
                  messages.featuredSpace.label.featureSpaceType
                )}>
                {featureSpaceTypes.map((c) => (
                  <Select.Option key={`${c.id}`} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.featuredSpace.label.active)}>
            {getFieldDecorator('active', {
              initialValue: false,
              valuePropName: 'checked',
              rules: [],
            })(<Switch />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.featuredSpace.label.picture)}>
            {getFieldDecorator('pictureFile', {
              rules: [
                {
                  required: !this.getURLFromData(defaultData),
                  message: intl.formatMessage(messages.validation.required),
                },
              ],
            })(
              <ImageInput
                defautlImagePreviewUrl={this.getURLFromData(defaultData)}
                maxSize={maxSize}
                messageSize={intl.formatMessage(messages.validation.maxSize, {
                  maxSize,
                })}
                dimesion={dimesion}
                messageDimension={intl.formatMessage(
                  messages.validation.dimension,
                  dimesion
                )}
              />
            )}
          </FormItem>
        </Form>
        <Tabs tabPosition="top">
          {Object.keys(translations).map((lang, index) => {
            const translateData = translations[lang];
            return (
              <Tabs.TabPane tab={lang.toUpperCase()} key={lang}>
                <FeaturedSpaceTranslationForm
                  {...translateData}
                  wrappedComponentRef={this.setTranslationFormRef(index)}
                  onChange={this.handleTranslationFormChange(lang)}
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

const WrappedFeaturedSpaceForm = Form.create()(FeaturedSpaceForm);

export default injectIntl(WrappedFeaturedSpaceForm, {
  withRef: true,
});
