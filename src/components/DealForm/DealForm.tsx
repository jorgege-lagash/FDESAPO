import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Tabs,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import moment from 'moment';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, tailFormItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Deal } from 'src/types/response/Deal';
import { Poi } from 'src/types/response/POI';
import { DealTranslationFormProps } from 'src/types/TranslationForm';
import {
  dateDisplayFormat,
  dateFormat,
  dateTimeDisplayFormat,
} from 'src/utils/event-directory.utils';
import { HttpService } from 'src/utils/request';
import { ImageInput } from '../ImageInput/ImageInput';
import { DealTranslationForm } from './DealTranslationForm';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface OwnState {
  translations: TypedLooseObject<DealTranslationFormProps>;
  poiTerm: string;
  pois: Poi[];
  fetching: boolean;
}

interface OwnProps {
  defaultData: Deal | null;
  saveButtonText?: string;
  translations?: TypedLooseObject<Deal>;
  currentLang: string;
  mallId: number;
  timezone: string;
  onSubmit(
    data: Deal,
    translations: TypedLooseObject<DealTranslationFormProps>
  ): void;
}

interface DealFormData {
  title: string;
  description: string;
}

interface DealFormValues {
  title: string;
  description: string;
  date: [moment.Moment, moment.Moment];
  announcementDate: [moment.Moment, moment.Moment];
}

const defaultProps = {
  saveButtonText: 'Guardar',
  poiTypes: [],
};

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class DealForm extends React.Component<Props, OwnState> {
  public static defaultProps = defaultProps;

  public state: OwnState = {
    translations: {},
    poiTerm: '',
    pois: [],
    fetching: false,
  };

  public translationforms: Array<React.ReactElement<any>> = [];

  constructor(props: Props) {
    super(props);
    this.fetchPois = debounce(this.fetchPois, 600);
    const translationDefaults = languages
      .filter((l) => l !== props.currentLang)
      .reduce(
        (acc, lang) => {
          acc[lang] = {
            title: { value: '' },
            description: { value: '' },
            pictureFile: { url: '', value: null },
          };
          return acc;
        },
        {} as TypedLooseObject<DealTranslationFormProps>
      );
    this.state.translations = translationDefaults;
  }

  public fetchPois = (value: string) => {
    this.fetchPoisRequest(value);
  };

  public fetchPoisRequest = async (value: string = '') => {
    const { mallId, defaultData } = this.props;
    const dealHeader = { 'a-mall-id': mallId };
    const dealOptions = { query: { name: value, limit: 100 } };
    const { data } = await HttpService.get('pois', dealOptions, dealHeader);
    let pois: Poi[] = data;
    if (defaultData && defaultData.poi) {
      const ids = data.map((p: Poi) => p.id);
      if (!ids.includes(defaultData.poi.id)) {
        pois = [...data, defaultData.poi];
      }
    }
    this.setState({ pois, fetching: false, poiTerm: value });
  };

  public renderSearchText = (text: string = '', searchText: string = '') => {
    return searchText ? (
      <span>
        {text
          .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))
          .map((fragment: string, i: any) =>
            fragment.toLowerCase() === searchText.toLowerCase() ? (
              <span key={i} className="highlight">
                {fragment}
              </span>
            ) : (
              fragment
            )
          )}
      </span>
    ) : (
      text
    );
  };

  public handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const forms = this.translationforms.map((tform) => tform.props.form);
    forms.push(this.props.form);
    const validationPromises = forms.map(
      (tform) =>
        new Promise((resolve, reject) => {
          tform.validateFieldsAndScroll((err: any, values: Deal) => {
            if (err) {
              reject(err);
              return false;
            }
            resolve(values);
            return true;
          });
        })
    );
    Promise.all(validationPromises).then((data: Deal[]) => {
      const values: any = this.props.form.getFieldsValue();
      const deal = {
        title: values.title,
        poiId: Number(values.poi.key),
        description: values.description,
        startDate: values.date[0].toISOString(),
        endDate: values.date[1].toISOString(),
        displayStartDate: values.announcementDate[0].format(dateFormat),
        displayEndDate: values.announcementDate[1].format(dateFormat),
        pictureFile: values.pictureFile,
      } as Deal;
      this.props.onSubmit(deal, this.state.translations);
    });
  };

  public dealToDealFormValues = (deal: Deal): DealFormValues => {
    const { timezone } = this.props;
    return {
      title: deal.title,
      description: deal.description,
      date: [
        moment(deal.startDate).tz(timezone),
        moment(deal.endDate).tz(timezone),
      ],
      announcementDate: [
        moment(deal.displayStartDate, dateFormat),
        moment(deal.displayEndDate, dateFormat),
      ],
    };
  };

  public componentDidMount() {
    this.fetchPoisRequest();

    if (this.props.defaultData) {
      const { defaultData } = this.props;
      const dealForm = defaultData;
      this.updateFormValues(this.dealToDealFormValues(dealForm));
    }
    if (this.props.defaultData && this.props.defaultData.poi) {
      this.props.form.setFieldsValue({ poi: `${this.props.defaultData.poi}` });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { defaultData, translations, form } = this.props;
    if (defaultData && prevProps.defaultData !== defaultData) {
      const dealForm = defaultData;
      this.updateFormValues(this.dealToDealFormValues(dealForm));
      if (defaultData.poi) {
        form.setFieldsValue({ poi: { key: `${defaultData.poi.id}` } });
      }
    }
    if (translations && translations !== prevProps.translations) {
      this.updateTranslationState(translations);
    }
  }

  public updateTranslationState = (translations: TypedLooseObject<Deal>) => {
    const translationDefaults = Object.keys(translations).reduce(
      (acc, lang) => {
        const currTranslate = translations[lang] || {};
        const pictureFile = currTranslate.pictureFile || null;
        const url = this.getURLFromData(currTranslate);
        return {
          ...acc,
          [lang]: {
            title: { value: currTranslate.title },
            description: { value: currTranslate.description },
            pictureFile: { url, value: pictureFile },
          },
        };
      },
      { ...this.state.translations } as TypedLooseObject<
        DealTranslationFormProps
      >
    );
    this.setState({ translations: translationDefaults });
  };

  public updateFormValues = (event: DealFormData) => {
    const { ...data } = event;
    const { form } = this.props;
    form.setFieldsValue({
      ...data,
    });
  };

  public handleTranslateChange = (
    data: DealTranslationFormProps,
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

  public handleKey = () => {
    this.setState({ fetching: true, pois: [] });
  };

  public handleBlur = () => {
    this.setState({ poiTerm: '' });
  };

  public handleTranslationFormChange = (lang: string) => (data: any) =>
    this.handleTranslateChange(data, lang);

  public getURLFromData = (data?: Partial<Deal> | null) => {
    if (!data || !data.picture) {
      return '';
    }
    return data.picture.url;
  };

  public render() {
    const { saveButtonText, defaultData, timezone } = this.props;
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;
    const { translations, poiTerm, pois, fetching } = this.state;
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
            label={intl.formatMessage(messages.deal.label.title)}>
            {getFieldDecorator('title', {
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
            label={intl.formatMessage(messages.deal.label.description)}>
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
            label={intl.formatMessage(messages.deal.label.date)}>
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
                  intl.formatMessage(messages.deal.label.startDate),
                  intl.formatMessage(messages.deal.label.endDate),
                ]}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.deal.label.announcementDate)}>
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
                  intl.formatMessage(messages.deal.label.startDate),
                  intl.formatMessage(messages.deal.label.endDate),
                ]}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.deal.label.poi)}>
            {getFieldDecorator('poi', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.validation.required),
                },
              ],
            })(
              <Select
                labelInValue={true}
                placeholder="Digitar nombre de POI"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                onSearch={this.fetchPois}
                showSearch={true}
                filterOption={false}
                onInputKeyDown={this.handleKey}
                onBlur={this.handleBlur}>
                {pois.map((poiE) => (
                  <Option key={`${poiE.id}`}>
                    {this.renderSearchText(poiE.name, poiTerm)}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl.formatMessage(messages.deal.label.picture)}>
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
                <DealTranslationForm
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

const WrappedDealForm = Form.create()(DealForm);

export default injectIntl(WrappedDealForm, {
  withRef: true,
});
