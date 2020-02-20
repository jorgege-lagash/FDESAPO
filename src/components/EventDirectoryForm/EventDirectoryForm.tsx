import { Button, Col, Form, Input, Row, Tabs } from 'antd';
import { DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, tailFormItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { EventDirectoryTranslationFormProps } from 'src/types/TranslationForm';
import {
  dateDisplayFormat,
  dateFormat,
  dateTimeDisplayFormat,
} from 'src/utils/event-directory.utils';
import { ImageInput } from '../ImageInput/ImageInput';
import { EventDirectoryTranslationForm } from './EventDirectoryTranslationForm';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

interface OwnState {
  translations: TypedLooseObject<EventDirectoryTranslationFormProps>;
}

interface OwnProps {
  defaultData: EventDirectory | null;
  saveButtonText?: string;
  translations?: TypedLooseObject<EventDirectory>;
  currentLang: string;
  timezone: string;
  onSubmit(
    data: EventDirectory,
    translations: TypedLooseObject<EventDirectoryTranslationFormProps>
  ): void;
}

interface EventForm {
  name: string;
  description: string;
  date: [moment.Moment, moment.Moment];
  announcementDate: [moment.Moment, moment.Moment];
}

const defaultProps = {
  saveButtonText: 'Guardar',
  poiTypes: [],
};

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class EventDirectoryForm extends React.Component<Props, OwnState> {
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
            name: { value: '' },
            description: { value: '' },
            pictureFile: { url: '', value: null },
          };
          return acc;
        },
        {} as TypedLooseObject<EventDirectoryTranslationFormProps>
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
          tform.validateFieldsAndScroll((err: any, values: EventDirectory) => {
            if (err) {
              reject(err);
              return false;
            }
            resolve(values);
            return true;
          });
        })
    );
    Promise.all(validationPromises).then((data: EventDirectory[]) => {
      const values: any = this.props.form.getFieldsValue();
      const event = {
        name: values.name,
        description: values.description,
        startDate: values.date[0].toISOString(),
        endDate: values.date[1].toISOString(),
        displayStartDate: values.announcementDate[0].format(dateFormat),
        displayEndDate: values.announcementDate[1].format(dateFormat),
        pictureFile: values.pictureFile,
      } as EventDirectory;
      this.props.onSubmit(event, this.state.translations);
    });
  };

  public eventToFormEvent = (event: EventDirectory): EventForm => {
    const { timezone } = this.props;
    return {
      name: event.name,
      description: event.description,
      date: [
        moment(event.startDate).tz(timezone),
        moment(event.endDate).tz(timezone),
      ],
      announcementDate: [
        moment(event.displayStartDate, dateFormat),
        moment(event.displayEndDate, dateFormat),
      ],
    };
  };

  public componentDidMount() {
    if (this.props.defaultData) {
      const { defaultData } = this.props;
      const eventForm = this.eventToFormEvent(defaultData);
      this.updateFormValues(eventForm);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { defaultData, translations } = this.props;
    if (defaultData && prevProps.defaultData !== defaultData) {
      const eventForm = this.eventToFormEvent(defaultData);
      this.updateFormValues(eventForm);
    }

    if (translations && translations !== prevProps.translations) {
      this.updateTranslationState(translations);
    }
  }

  public updateTranslationState = (
    translations: TypedLooseObject<EventDirectory>
  ) => {
    const translationDefaults = Object.keys(translations).reduce(
      (acc, lang) => {
        const currTranslate = translations[lang] || {};
        const pictureFile = currTranslate.pictureFile || null;
        const url = this.getURLFromData(currTranslate);
        return {
          ...acc,
          [lang]: {
            name: { value: currTranslate.name },
            description: { value: currTranslate.description },
            pictureFile: { url, value: pictureFile },
          },
        };
      },
      { ...this.state.translations } as TypedLooseObject<
        EventDirectoryTranslationFormProps
      >
    );
    this.setState({ translations: translationDefaults });
  };

  public updateFormValues = (event: EventForm) => {
    const { ...data } = event;
    const { form } = this.props;
    form.setFieldsValue({
      ...data,
    });
  };

  public handleTranslateChange = (
    data: EventDirectoryTranslationFormProps,
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

  public getURLFromData = (data?: Partial<EventDirectory> | null) => {
    if (!data || !data.picture) {
      return '';
    }
    return data.picture.url;
  };

  public render() {
    const { saveButtonText, defaultData, timezone } = this.props;
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;
    const { translations } = this.state;
    const dimesion = { width: 184, height: 184 };
    const maxSize = 2;
    const defaultStartValue = moment()
      .tz(timezone)
      .startOf('day');
    const defaultEndValue = moment()
      .tz(timezone)
      .add(1, 'day')
      .startOf('day');
    return (
      <>
        <Form>
          <h3>Información General</h3>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.event.label.name)}>
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
            label={intl.formatMessage(messages.event.label.description)}>
            {getFieldDecorator('description', {
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
            label={intl.formatMessage(messages.event.label.date)}>
            {getFieldDecorator('date', {
              initialValue: [defaultStartValue, defaultEndValue],
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.validation.required),
                },
              ],
            })(
              <RangePicker
                showTime={{ format: 'HH:mm', placeholder: 'Selecinar Hora' }}
                format={dateTimeDisplayFormat}
                placeholder={[
                  intl.formatMessage(messages.event.label.startDate),
                  intl.formatMessage(messages.event.label.endDate),
                ]}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.event.label.announcementDate)}>
            {getFieldDecorator('announcementDate', {
              initialValue: [defaultStartValue, defaultEndValue],
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.validation.required),
                },
              ],
            })(
              <RangePicker
                format={dateDisplayFormat}
                placeholder={[
                  intl.formatMessage(messages.event.label.startDate),
                  intl.formatMessage(messages.event.label.endDate),
                ]}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.event.label.picture)}>
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
                square={true}
                messageSquare={intl.formatMessage(
                  messages.validation.square,
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
                <EventDirectoryTranslationForm
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

const WrappedEventDirectoryForm = Form.create()(EventDirectoryForm);

export default injectIntl(WrappedEventDirectoryForm, {
  withRef: true,
});
