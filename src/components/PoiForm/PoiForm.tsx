import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { intersection } from 'lodash';
import { get } from 'lodash';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import * as api from 'src/api';
import {
  tailFormItemLayout,
  telPattern,
  urlPattern,
  slugPattern,
} from 'src/constants/formitem';
import { MapImageGenerator } from 'src/pages/MapPocPage/MapImageGenerator';
import {
  filterPwPoisByPoiType,
  filterPwPoisBySuc,
} from 'src/selectors/maas.selector';
import messages from 'src/translations/default/messages';
import { languages } from 'src/types/lang';
import { TagType } from 'src/types/tagType';
import { TypedLooseObject } from 'src/types/LooseObject';
import { PoiTypeEnum } from 'src/types/PoiTypeEnum';
import { Category } from 'src/types/response/Category';
import { Channel } from 'src/types/response/Channel';
import { FileDTO } from 'src/types/response/FileDTO';
import { Poi, PoiFormData } from 'src/types/response/POI';
import { PoiState } from 'src/types/response/PoiState';
import { PoiType } from 'src/types/response/PoiType';
import { PwPoi } from 'src/types/response/PwPoi';
import { Tag } from 'src/types/response/Tag';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import { PoiTranslationFormProps } from 'src/types/TranslationForm';
import { getUrlFromData, parseObjectListIds, unique } from 'src/utils';
import { poiToCompleteName } from 'src/utils/map.utils';
import { compareFilterStrings } from 'src/utils/table.utils';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ImageInput } from '../ImageInput/ImageInput';
import { PoiTranslationForm } from '../PoiTranslationForm/PoiTranslationForm';

const FormItem = Form.Item;

interface OwnState {
  suc: string;
  poiTypeId: number;
  poiStateId: number;
  pwPoiSearchTerm: string;
  tagSearchTerm: string;
  file?: File;
  hasTouristDiscount: boolean;
  translations: TypedLooseObject<PoiTranslationFormProps>;
  newTags: Tag[];
  tagText: string;
  categoryText?: string;
}

interface OwnProps {
  isLoadingPwPois: boolean;
  isLoadingCategories: boolean;
  currentLang: string;
  defaultData: Poi | null;
  defaultDiscountData: TravelerDiscount | null;
  discountId: number;
  pwPoiById: TypedLooseObject<PwPoi>;
  categories: Category[];
  tags: Tag[];
  channels: Channel[];
  poiStates: PoiState[];
  poiTypes: PoiType[];
  pwPois: PwPoi[];
  saveButtonText?: string;
  translations?: TypedLooseObject<Poi>;
  discountTranslations?: TypedLooseObject<TravelerDiscount>;
  logoData: FileDTO | null;
  onSubmit(
    store: PoiFormData,
    translations: TypedLooseObject<PoiTranslationFormProps>,
    newTags: Tag[]
  ): void;
  onCancelAction(): void;
}

const defaultProps = {
  saveButtonText: 'Guardar',
  categories: [],
  tags: [],
  poiTypes: [],
  pwPois: [],
  channels: [],
  pwPoiById: {},
};

const dimension = { width: 184, height: 184 };

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class POIForm extends React.PureComponent<Props, OwnState> {
  public static defaultProps = defaultProps;
  public refTags = React.createRef<Select>();
  public state: OwnState = {
    suc: '',
    poiTypeId: 0,
    poiStateId: 0,
    translations: {},
    hasTouristDiscount: false,
    pwPoiSearchTerm: '',
    tagSearchTerm: '',
    newTags: [],
    tagText: '',
  };
  constructor(props: Props) {
    super(props);
    const translationDefaults = languages
      .filter((l) => props.currentLang)
      .reduce(
        (acc, lang) => {
          acc[lang] = {
            description: { value: '' },
            name: { value: '' },
            tags: { value: '' },
            discountDescription: { value: '' },
            discountPicture: { url: '', value: null },
          };
          return acc;
        },
        {} as TypedLooseObject<PoiTranslationFormProps>
      );
    this.state.translations = translationDefaults;
  }

  public handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { newTags } = this.state;

    this.props.form.validateFields((err: any, values: PoiFormData) => {
      const { defaultData, discountId } = this.props;
      if (!err) {
        if (defaultData) {
          values.discountId = discountId;
        }
        this.props.onSubmit(values, this.state.translations, newTags);
      }
      return false;
    });
  };

  public componentDidMount() {
    const { defaultData, form } = this.props;
    if (defaultData) {
      this.updateFormValues(defaultData);
      if (defaultData.tags.length > 0) {
        form.setFieldsValue({
          tags: parseObjectListIds(defaultData.tags),
        });
      }
      this.verifyPwPois();
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: OwnState) {
    const {
      defaultData,
      translations,
      channels,
      defaultDiscountData,
      discountTranslations,
    } = this.props;
    const { hasTouristDiscount } = this.state;
    this.updateFormValuesAndDeal(defaultData, prevProps);
    if (
      defaultDiscountData &&
      (prevProps.defaultDiscountData !== defaultDiscountData ||
        prevState.hasTouristDiscount !== hasTouristDiscount)
    ) {
      this.updateDiscountFormValues();
      this.updateTranslationState(translations || {});
    }

    this.updateCategorySelection(prevProps);

    this.updateChannelSelection(channels, prevProps);

    this.updateTagSelection(prevProps);

    this.updatePwPoiSelection(prevProps);

    if (
      translations &&
      (translations !== prevProps.translations ||
        discountTranslations !== prevProps.discountTranslations)
    ) {
      this.updateTranslationState(translations);
    }
  }

  public verifyPwPois() {
    const { form, defaultData } = this.props;
    const ids = defaultData ? parseObjectListIds(defaultData.poisPhunware) : [];
    const pwFormLength = form.getFieldValue('poisPhunware')
      ? form.getFieldValue('poisPhunware').length
      : 0;
    if (ids !== [] && pwFormLength !== ids.length) {
      form.setFieldsValue({ poisPhunware: ids });
    }
  }

  public updateTranslationState = (translations: TypedLooseObject<Poi>) => {
    const { currentLang, discountTranslations = {} } = this.props;

    const translationDefaults = Object.keys(translations)
      .filter((l) => l !== currentLang)
      .reduce(
        (acc, lang) => {
          const currTranslate = translations[lang] || {};
          const translatedDiscount = discountTranslations[lang] || {};
          const pictureFile = translatedDiscount.pictureFile || null;
          const url = getUrlFromData(translatedDiscount);
          return {
            ...acc,
            [lang]: {
              description: { value: currTranslate.description || '' },
              name: { value: currTranslate.name || '' },
              tags: { value: '' },
              discountDescription: {
                value: translatedDiscount.description || '',
              },
              discountPicture: { url, value: pictureFile },
            },
          };
        },
        { ...this.state.translations } as TypedLooseObject<
          PoiTranslationFormProps
        >
      );
    this.setState({ translations: translationDefaults });
  };

  public updateFormValues = (store: Poi) => {
    const {
      created,
      modified,
      logo,
      location,
      poisPhunware,
      channels,
      tags,
      ...data
    } = store;
    const { form } = this.props;

    form.setFieldsValue({
      ...data,
      description: store.description || '',
    });
    this.setState({
      suc: data.suc || '',
      poiTypeId: Number(data.poiTypeId) || 0,
    });
  };

  public updateDiscountFormValues = () => {
    const { form, defaultDiscountData } = this.props;
    if (!defaultDiscountData) {
      return;
    }
    const data = {
      discountDescription: defaultDiscountData.description || '',
      discount: defaultDiscountData.discount,
    };

    form.setFieldsValue({
      ...data,
    });
  };

  public handleSucChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const suc = event.target.value;
    this.setState({ suc });
  };

  public handleCancelAction = () => {
    this.props.onCancelAction();
  };

  public getFilteredPwPois = () => {
    const { pwPois, pwPoiById } = this.props;
    const { suc, pwPoiSearchTerm, poiTypeId } = this.state;
    let result: PwPoi[];
    if (
      PoiTypeEnum.store === poiTypeId ||
      poiTypeId === PoiTypeEnum.restaurant
    ) {
      result = filterPwPoisBySuc(pwPois, suc);
    } else if (poiTypeId === PoiTypeEnum.parking) {
      result = filterPwPoisByPoiType(pwPois, poiTypeId);
    } else {
      result = pwPois;
    }
    if (pwPoiSearchTerm) {
      result = result.filter((poi) =>
        compareFilterStrings(pwPoiSearchTerm, poiToCompleteName(poi))
      );
    }

    const data = unique(
      parseObjectListIds([...result.slice(0, 100), ...this.selectedPwPois])
    )
      .map((id) => pwPoiById[id])
      .filter((x) => x);
    return {
      data,
      count: result.length,
    };
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

  public handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    this.setState({ file });
  };

  public handleTranslateChange = (
    data: PoiTranslationFormProps,
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

  public handlePwPoiSelectSearch = (value: string) => {
    this.setState({ pwPoiSearchTerm: value });
  };

  public handlePoiTypeChange = (poiType: number) => {
    this.setState({ poiTypeId: poiType || 0 });
  };

  public handlePoiStateChange = (poiState: number) => {
    this.setState({ poiStateId: poiState || 0 });
  };

  public clearPwPoiSearchTerm = () => {
    this.setState({ pwPoiSearchTerm: '' });
  };

  public updateFormValuesAndDeal(defaultData: Poi | null, prevProps: Props) {
    if (defaultData && prevProps.defaultData !== defaultData) {
      this.updateFormValues(defaultData);
    }
  }

  public get column3Fields() {
    const {
      intl,
      form: { getFieldDecorator },
      isLoadingPwPois,
      defaultData,
    } = this.props;
    const { poiTypeId, pwPoiSearchTerm } = this.state;
    const isSucDisabled =
      PoiTypeEnum.store !== poiTypeId && poiTypeId !== PoiTypeEnum.restaurant;
    const {
      data: filteredPwPois,
      count: filteredPwPoisLength,
    } = this.getFilteredPwPois();
    const selectedPhunwarePois = this.selectedPwPois;
    return (
      <>
        <Row>
          <Col span={12}>
            <FormItem label={intl.formatMessage(messages.store.label.floor)}>
              {getFieldDecorator('floor', {
                initialValue: 0,
                rules: [],
              })(
                <InputNumber
                  step={1}
                  style={{ width: '95%' }}
                  // tslint:disable-next-line:jsx-no-lambda
                  parser={(value) => {
                    const val = value ? `${value}` : '0';
                    return Number(Number(val).toFixed(0));
                  }}
                  placeholder={intl.formatMessage(
                    messages.store.placeholder.floor
                  )}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={intl.formatMessage(messages.store.label.suc)}>
              {getFieldDecorator('suc', {
                rules: [],
              })(
                <Input
                  disabled={isSucDisabled}
                  placeholder={intl.formatMessage(
                    messages.store.placeholder.suc
                  )}
                  onChange={this.handleSucChange}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <ErrorBoundary>
          <Spin
            spinning={isLoadingPwPois}
            indicator={
              <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
            }>
            <FormItem
              label={`${intl.formatMessage(
                messages.store.label.poisPhunware
              )} (${filteredPwPoisLength})`}>
              {getFieldDecorator('poisPhunware', {
                rules: [
                  {
                    validator: this.checkPwPoi,
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder={intl.formatMessage(
                    messages.store.placeholder.poisPhunware
                  )}
                  onChange={this.clearPwPoiSearchTerm}
                  onBlur={this.clearPwPoiSearchTerm}
                  onSearch={this.handlePwPoiSelectSearch}
                  filterOption={false}>
                  {filteredPwPois.map((p) => (
                    <Select.Option key={`${p.id}`} value={p.id}>
                      {this.renderSearchText(
                        poiToCompleteName(p),
                        pwPoiSearchTerm
                      )}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Spin>
        </ErrorBoundary>
        <ErrorBoundary>
          <Spin
            spinning={isLoadingPwPois}
            indicator={
              <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
            }>
            <FormItem
              label={intl.formatMessage(messages.store.label.screenshot)}>
              {getFieldDecorator('poiImage', {
                rules: [],
              })(
                <MapImageGenerator
                  defaultImage={
                    (defaultData &&
                      defaultData.screenshot &&
                      defaultData.screenshot.url) ||
                    null
                  }
                  pois={selectedPhunwarePois}
                />
              )}
            </FormItem>
          </Spin>
        </ErrorBoundary>
        <FormItem label={intl.formatMessage(messages.store.label.facebook)}>
          {getFieldDecorator('facebook', {
            rules: [
              {
                pattern: urlPattern,
                message: intl.formatMessage(messages.validation.urlFormat),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.store.placeholder.facebook
              )}
            />
          )}
        </FormItem>
        <FormItem label={intl.formatMessage(messages.store.label.instagram)}>
          {getFieldDecorator('instagram', {
            rules: [
              {
                pattern: urlPattern,
                message: intl.formatMessage(messages.validation.urlFormat),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.store.placeholder.instagram
              )}
            />
          )}
        </FormItem>
        <FormItem label={intl.formatMessage(messages.store.label.slug)}>
          {getFieldDecorator('slug', {
            rules: [
              {
                required: true,
                pattern: slugPattern,
                message: intl.formatMessage(messages.validation.slugFormat),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(messages.store.placeholder.slug)}
            />
          )}
        </FormItem>
        <FormItem label={intl.formatMessage(messages.store.label.urlMap)}>
          {getFieldDecorator('urlMap', {
            rules: [
              {
                pattern: urlPattern,
                message: intl.formatMessage(messages.validation.urlFormat),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.store.placeholder.urlMap
              )}
            />
          )}
        </FormItem>
      </>
    );
  }

  public get column2Fields() {
    const {
      intl,
      form: { getFieldDecorator },
      poiTypes,
      poiStates,
      isLoadingCategories,
    } = this.props;
    const { tagText, categoryText } = this.state;
    const filteredTags = this.getFilteredTags();
    const tagsByType = this.getTagsByType(filteredTags, TagType.store);

    const filteredCategories = this.getFilteredCategories();
    return (
      <>
        <FormItem label={intl.formatMessage(messages.store.label.name)}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: intl.formatMessage(
                  messages.store.validation.name.required
                ),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(messages.store.placeholder.name)}
            />
          )}
        </FormItem>
        <ErrorBoundary>
          <Spin
            spinning={isLoadingCategories}
            indicator={
              <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
            }>
            <FormItem
              label={intl.formatMessage(messages.store.label.categories)}>
              {getFieldDecorator('categories', {
                rules: [],
              })(
                <Select
                  mode="multiple"
                  placeholder={intl.formatMessage(
                    messages.store.placeholder.categories
                  )}
                  filterOption={false}
                  onSearch={this.handleCategorySelectSearch}
                  onChange={this.onClearCategoryText}>
                  {filteredCategories.map((c) => (
                    <Select.Option key={`${c.id}`} value={c.id}>
                      {this.renderSearchText(c.name, categoryText)}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Spin>
        </ErrorBoundary>
        <ErrorBoundary>
          <FormItem label={intl.formatMessage(messages.store.label.poiType)}>
            {getFieldDecorator('poiTypeId', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.store.validation.poiTypeId.required
                  ),
                },
              ],
            })(
              <Select
                placeholder={intl.formatMessage(
                  messages.store.placeholder.poiType
                )}
                onChange={this.handlePoiTypeChange}>
                {poiTypes.map((c) => (
                  <Select.Option key={`${c.id}`} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </ErrorBoundary>
        <ErrorBoundary>
          <FormItem label={intl.formatMessage(messages.store.label.poiState)}>
            {getFieldDecorator('poiStateId', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    messages.store.validation.poiStateId.required
                  ),
                },
              ],
            })(
              <Select
                placeholder={intl.formatMessage(
                  messages.store.placeholder.poiState
                )}
                onChange={this.handlePoiTypeChange}>
                {poiStates.map((c) => (
                  <Select.Option key={`${c.id}`} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </ErrorBoundary>
        <ErrorBoundary>
          <Spin
            spinning={isLoadingCategories}
            indicator={
              <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
            }>
            <FormItem
              label={intl.formatMessage(messages.store.label.relatedStores)}
              extra={
                <span>
                  Para crear una nueva tienda, digite el nombre añadiendo una
                  coma. Ejemplo:{' '}
                  <i>
                    <b>IKEA,</b>
                  </i>
                  .
                </span>
              }>
              {getFieldDecorator('relatedStores', {
                rules: [],
              })(
                <Select
                  mode="multiple"
                  onSearch={this.handleTagSelectSearch}
                  onBlur={this.onClearTagText}
                  onChange={this.onClearTagText}
                  onDeselect={this.onDeselectTag}
                  // tslint:disable-next-line:jsx-no-lambda
                  onInputKeyDown={(data: any) =>
                    this.onKey(data, 1, TagType.store, 2)
                  }
                  ref={this.refTags}
                  placeholder={intl.formatMessage(
                    messages.store.placeholder.relatedStores
                  )}
                  filterOption={false}>
                  {tagsByType.map((tag) => (
                    <Select.Option key={`${tag.id}`} value={tag.id}>
                      {this.renderSearchText(tag.name, tagText)}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Spin>
        </ErrorBoundary>
        <FormItem label={intl.formatMessage(messages.store.label.website)}>
          {getFieldDecorator('website', {
            rules: [
              {
                pattern: urlPattern,
                message: intl.formatMessage(messages.validation.urlFormat),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.store.placeholder.website
              )}
            />
          )}
        </FormItem>
        <FormItem label={intl.formatMessage(messages.store.label.telephone)}>
          {getFieldDecorator('telephone', {
            rules: [
              {
                pattern: telPattern,
                message: intl.formatMessage(messages.validation.telFormat),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.store.placeholder.telephone
              )}
            />
          )}
        </FormItem>
      </>
    );
  }

  public handleHasDiscountChange = (hasTouristDiscount: boolean) => {
    this.setState({ hasTouristDiscount });
  };

  public get touristDiscountFields() {
    const {
      intl,
      form: { getFieldDecorator },
      defaultDiscountData,
    } = this.props;
    const discountURL = getUrlFromData(defaultDiscountData);
    return (
      <>
        <h3>{intl.formatMessage(messages.store.label.discountTitle)}</h3>
        <FormItem label={intl.formatMessage(messages.store.label.discount)}>
          {getFieldDecorator('discount', {
            initialValue: '',
            rules: [
              {
                max: 15,
                message: intl.formatMessage(messages.validation.maxLength, {
                  maxLength: 15,
                }),
              },
              {
                required: true,
                message: intl.formatMessage(messages.validation.required),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.store.placeholder.discount
              )}
            />
          )}
        </FormItem>
        <FormItem
          label={intl.formatMessage(messages.store.label.discountDescription)}>
          {getFieldDecorator('discountDescription', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: intl.formatMessage(messages.validation.required),
              },
            ],
          })(
            <TextArea
              autosize={{ minRows: 4, maxRows: 6 }}
              placeholder={intl.formatMessage(
                messages.store.placeholder.discountDescription
              )}
            />
          )}
        </FormItem>
        <FormItem
          label={intl.formatMessage(messages.store.label.discountPicture)}>
          {getFieldDecorator('discountPicture', {
            rules: [
              {
                required: !discountURL,
                message: intl.formatMessage(messages.validation.required),
              },
            ],
          })(
            <ImageInput
              defautlImagePreviewUrl={discountURL}
              dimesion={dimension}
              square={true}
              messageSquare={intl.formatMessage(
                messages.validation.square,
                dimension
              )}
            />
          )}
        </FormItem>
      </>
    );
  }

  public get selectedPwPois() {
    const { form, pwPoiById } = this.props;
    const selectedPwPoiIds: number[] = form.getFieldValue('poisPhunware') || [];
    return selectedPwPoiIds.map((id) => pwPoiById[id]).filter((x) => x);
  }

  // tslint:disable-next-line:no-big-function
  public render() {
    const {
      saveButtonText,
      channels,
      currentLang,
      form,
      intl,
      logoData,
      isLoadingCategories,
    } = this.props;
    const { tagText, translations } = this.state;

    const filteredTags = this.getFilteredTags();
    const tagsByType = this.getTagsByType(filteredTags, TagType.product);
    const tagsES = this.getTagsByLanguage(tagsByType, 1);
    const tagsEN = this.getTagsByLanguage(tagsByType, 2);
    const tagsPT = this.getTagsByLanguage(tagsByType, 3);

    const logoUrl = logoData && logoData.url ? logoData.url : '';
    const { getFieldDecorator } = form;
    const hasTouristDiscount: boolean = form.getFieldValue(
      'hasTouristDiscount'
    );
    const initialChannels = channels.map((c) => c.id);
    return (
      <>
        <Card>
          <Form layout="vertical">
            <Row gutter={24}>
              <Col className="gutter-row" span={24}>
                <h3>Información General</h3>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label={intl.formatMessage(messages.store.label.logo)}
                  extra="Logo de tienda">
                  {getFieldDecorator('logoFile', {})(
                    <ImageInput defautlImagePreviewUrl={logoUrl} />
                  )}
                </Form.Item>
                <ErrorBoundary>
                  <FormItem
                    label={intl.formatMessage(messages.store.label.channels)}>
                    {getFieldDecorator('channels', {
                      rules: [],
                      initialValue: initialChannels,
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          {channels.map((c, index) => {
                            return (
                              <Col span={24} key={`${index}-${c.id}`}>
                                <Checkbox value={c.id} checked={true}>
                                  {`${c.name}`}
                                </Checkbox>
                              </Col>
                            );
                          })}
                        </Row>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </ErrorBoundary>
                <FormItem
                  label={intl.formatMessage(
                    messages.store.label.hasTouristDiscount
                  )}>
                  {getFieldDecorator('hasTouristDiscount', {
                    valuePropName: 'checked',
                    rules: [],
                  })(<Switch onChange={this.handleHasDiscountChange} />)}
                </FormItem>
                <FormItem {...tailFormItemLayout} />
              </Col>
              <Col className="gutter-row" span={9}>
                {this.column2Fields}
              </Col>
              <Col className="gutter-row" span={9}>
                {this.column3Fields}
              </Col>
            </Row>
          </Form>
        </Card>
        <br />
        <Card>
          <Tabs tabPosition="top">
            <Tabs.TabPane tab="ES" key="es">
              <Row gutter={16}>
                <Col
                  className="gutter-row"
                  span={12}
                  offset={hasTouristDiscount ? 0 : 6}>
                  <h3>Detalles</h3>
                  <FormItem
                    label={intl.formatMessage(
                      messages.store.label.description
                    )}>
                    {getFieldDecorator('description', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: intl.formatMessage(
                            messages.store.validation.description.required
                          ),
                        },
                      ],
                    })(
                      <Input.TextArea
                        autosize={{ minRows: 4, maxRows: 6 }}
                        placeholder={intl.formatMessage(
                          messages.store.placeholder.description
                        )}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col className="gutter-row" span={12}>
                  {hasTouristDiscount && this.touristDiscountFields}
                </Col>
              </Row>
            </Tabs.TabPane>
            {Object.keys(translations)
              .filter((l) => l !== currentLang)
              .map((lang) => {
                const translateData = translations[lang];
                return (
                  <Tabs.TabPane tab={lang.toUpperCase()} key={lang}>
                    <PoiTranslationForm
                      {...translateData}
                      // tslint:disable-next-line:jsx-no-lambda
                      onChange={(data: any) =>
                        this.handleTranslateChange(data, lang)
                      }
                      hasTouristDiscount={hasTouristDiscount}
                    />
                  </Tabs.TabPane>
                );
              })}
          </Tabs>
        </Card>

        <br />
        <Card>
          <Tabs tabPosition="top">
            <Tabs.TabPane tab="ES" key="es">
              <Row gutter={16}>
                <Col span={12} offset={6}>
                  <ErrorBoundary>
                    <Spin
                      spinning={isLoadingCategories}
                      indicator={
                        <Icon
                          type="loading"
                          style={{ fontSize: 24 }}
                          spin={true}
                        />
                      }>
                      <FormItem
                        label={intl.formatMessage(messages.store.label.tags)}
                        extra={
                          <span>
                            Para crear un nuevo tag, digite el nombre añadiendo
                            una coma. Ejemplo:{' '}
                            <i>
                              <b>Zapatillas,</b>
                            </i>
                            .
                          </span>
                        }>
                        {getFieldDecorator('tagsES', {
                          rules: [],
                        })(
                          <Select
                            style={{
                              display: 'block',
                            }}
                            mode="multiple"
                            onSearch={this.handleTagSelectSearch}
                            onBlur={this.onClearTagText}
                            onChange={this.onClearTagText}
                            onDeselect={this.onDeselectTag}
                            // tslint:disable-next-line:jsx-no-lambda
                            onInputKeyDown={(data: any) =>
                              this.onKey(data, 1, TagType.product, 1)
                            }
                            ref={this.refTags}
                            placeholder={intl.formatMessage(
                              messages.store.placeholder.tags
                            )}
                            filterOption={false}>
                            {tagsES.map((tag) => (
                              <Select.Option key={`${tag.id}`} value={tag.id}>
                                {this.renderSearchText(tag.name, tagText)}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Spin>
                  </ErrorBoundary>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="EN" key="en">
              <Row gutter={16}>
                <Col span={12} offset={6}>
                  <ErrorBoundary>
                    <Spin
                      spinning={isLoadingCategories}
                      indicator={
                        <Icon
                          type="loading"
                          style={{ fontSize: 24 }}
                          spin={true}
                        />
                      }>
                      <FormItem
                        label={intl.formatMessage(messages.store.label.tags)}
                        extra={
                          <span>
                            Para crear un nuevo tag, digite el nombre añadiendo
                            una coma. Ejemplo:{' '}
                            <i>
                              <b>Zapatillas,</b>
                            </i>
                            .
                          </span>
                        }>
                        {getFieldDecorator('tagsEN', {
                          rules: [],
                        })(
                          <Select
                            style={{
                              display: 'block',
                            }}
                            mode="multiple"
                            onSearch={this.handleTagSelectSearch}
                            onBlur={this.onClearTagText}
                            onChange={this.onClearTagText}
                            onDeselect={this.onDeselectTag}
                            // tslint:disable-next-line:jsx-no-lambda
                            onInputKeyDown={(data: any) =>
                              this.onKey(data, 2, TagType.product, 1)
                            }
                            ref={this.refTags}
                            placeholder={intl.formatMessage(
                              messages.store.placeholder.tags
                            )}
                            filterOption={false}>
                            {tagsEN.map((tag) => (
                              <Select.Option key={`${tag.id}`} value={tag.id}>
                                {this.renderSearchText(tag.name, tagText)}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Spin>
                  </ErrorBoundary>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="PT" key="pt">
              <Row gutter={16}>
                <Col span={12} offset={6}>
                  <ErrorBoundary>
                    <Spin
                      spinning={isLoadingCategories}
                      indicator={
                        <Icon
                          type="loading"
                          style={{ fontSize: 24 }}
                          spin={true}
                        />
                      }>
                      <FormItem
                        label={intl.formatMessage(messages.store.label.tags)}
                        extra={
                          <span>
                            Para crear un nuevo tag, digite el nombre añadiendo
                            una coma. Ejemplo:{' '}
                            <i>
                              <b>Zapatillas,</b>
                            </i>
                            .
                          </span>
                        }>
                        {getFieldDecorator('tagsPT', {
                          rules: [],
                        })(
                          <Select
                            style={{
                              display: 'block',
                            }}
                            mode="multiple"
                            onSearch={this.handleTagSelectSearch}
                            onBlur={this.onClearTagText}
                            onChange={this.onClearTagText}
                            onDeselect={this.onDeselectTag}
                            // tslint:disable-next-line:jsx-no-lambda
                            onInputKeyDown={(data: any) =>
                              this.onKey(data, 3, TagType.product, 1)
                            }
                            ref={this.refTags}
                            placeholder={intl.formatMessage(
                              messages.store.placeholder.tags
                            )}
                            filterOption={false}>
                            {tagsPT.map((tag) => (
                              <Select.Option key={`${tag.id}`} value={tag.id}>
                                {this.renderSearchText(tag.name, tagText)}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Spin>
                  </ErrorBoundary>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Card>

        <br />
        <Row type="flex" justify="end" gutter={16}>
          <Col className="gutter-row" span={3} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSubmit}>
              {saveButtonText}
            </Button>
          </Col>
          <Col className="gutter-row" span={3} style={{ textAlign: 'right' }}>
            <Button onClick={this.handleCancelAction}>Cancelar</Button>
          </Col>
          <Col className="gutter-row" span={1}>
            {''}
          </Col>
        </Row>
      </>
    );
  }

  private updateMultiSelectInput<T>(
    formFieldName: string,
    currentDefaultSelection: T[] = [],
    prevDefaultSelection: T[] = []
  ) {
    const { form } = this.props;
    const currentSelectionLength: number = currentDefaultSelection.length;
    const commonIds = intersection(
      parseObjectListIds(prevDefaultSelection),
      parseObjectListIds(currentDefaultSelection)
    );
    if (commonIds.length !== currentSelectionLength) {
      form.resetFields([formFieldName]);
      const defaultIds: number[] = parseObjectListIds(currentDefaultSelection);
      form.setFieldsValue({
        [formFieldName]: defaultIds,
      });
    }
  }

  private updateMultiSelectFieldSelection<T>(
    fieldName: string,
    prevProps: Props
  ) {
    const { defaultData } = this.props;
    const currentDefaultSelection = get(defaultData, fieldName, []) as T[];
    const prevDefaultSelection = get(
      prevProps.defaultData,
      fieldName,
      []
    ) as T[];
    this.updateMultiSelectInput(
      fieldName,
      currentDefaultSelection,
      prevDefaultSelection
    );
  }

  private updatePwPoiSelection(prevProps: Props) {
    this.updateMultiSelectFieldSelection<PwPoi>('poisPhunware', prevProps);
  }

  private updateChannelSelection(channels: Channel[], prevProps: Props) {
    const { form, defaultData } = this.props;
    const prevChannels = prevProps.channels;
    if (channels !== prevChannels) {
      form.resetFields(['channels']);
      if (
        defaultData &&
        defaultData.channels &&
        defaultData.channels.length > 0
      ) {
        const defaultIds: number[] = parseObjectListIds(defaultData.channels);
        const channelIds = parseObjectListIds(channels);
        const ids = intersection(channelIds, defaultIds);
        form.setFieldsValue({
          channels: ids,
        });
      } else if (!defaultData) {
        const channelIds = parseObjectListIds(channels);
        form.setFieldsValue({
          channels: channelIds,
        });
      }
    }
  }

  private updateTagSelection(prevProps: Props) {
    this.updateMultiSelectFieldSelection<Tag>('tags', prevProps);
  }

  private updateCategorySelection(prevProps: Props) {
    this.updateMultiSelectFieldSelection<Category>('categories', prevProps);
  }

  private onKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
    lang: number,
    type: string,
    tagtype: number
  ) => {
    const { tagText } = this.state;
    // 188 comma keycode ','
    if (event.keyCode === 188 && tagText !== '') {
      const { form } = this.props;
      const dateT = `N${new Date().getTime()}`;

      const newTag: Tag = {
        name: tagText,
        id: dateT,
        languageId: lang,
        tagTypeId: tagtype,
        type,
      } as any;
      const currentTags: Tag[] = form.getFieldValue('tags') || [];
      const matchingNewRecord = currentTags.find((t) => t.name === tagText);
      const matchingOldRecord = this.getFilteredTags().find(
        (t) => t.name === tagText
      );
      if (matchingNewRecord || matchingOldRecord) {
        return;
      }
      let formTags = [];
      formTags = [...currentTags, newTag.id];
      form.setFieldsValue({ tags: formTags });
      const newTags = [...this.state.newTags, newTag];
      this.setState({
        newTags,
        tagText: '',
      });
      if (this.refTags.current !== null) {
        this.refTags.current.blur();
      }
    }
  };

  private checkPwPoi = async (
    rule: any,
    value: number[] = [],
    callback: any,
    source?: any,
    options?: any
  ) => {
    const { pwPoiById, defaultData } = this.props;
    const currentPwIds = defaultData
      ? parseObjectListIds(defaultData.poisPhunware).map((x) => Number(x))
      : [];
    const newOptions = value.filter((id) => !currentPwIds.includes(Number(id)));
    const validations = newOptions.map((val) => {
      return api.poi.validateIsPwPoiAssociated(1, val);
    });
    const ValidationResponse = await Promise.all(validations);
    const invalidPositions = ValidationResponse.map((poi, index) => {
      if (poi !== null) {
        const pwpoi: PwPoi = pwPoiById[newOptions[index]] || {};
        return { index, poi, pwpoi };
      }
      return null;
    }).filter((x, index) => x !== null);
    if (invalidPositions.length === 0) {
      callback();
      return;
    } else {
      callback(
        `${poiToCompleteName(invalidPositions[0]!.pwpoi)} ya esta asignado`
      );
    }
  };
  private handleTagSelectSearch = (tagText: string) => {
    this.setState({ tagText: tagText.replace(/,/g, '') });
  };

  private onClearTagText = () => {
    this.setState({ tagText: '' });
  };

  private onDeselectTag = (param: any) => {
    const changedTags = this.state.newTags.filter((newTag) => {
      return newTag.id !== param;
    });
    this.setState({ newTags: changedTags });
  };

  private getFilteredTags = () => {
    const { tagText, newTags } = this.state;
    const tags = [...this.props.tags, ...newTags];
    let result: Tag[] = [];
    result = tags.filter((tag) => compareFilterStrings(tagText, tag.name));

    return result;
  };

  private getTagsByType = (tags: Tag[], type: string) => {
    return tags.filter((tag) => tag.type === type);
  };

  private getTagsByLanguage = (tags: Tag[], lang: number) => {
    return tags.filter((tag) => tag.languageId === lang);
  };

  private onClearCategoryText = () => {
    this.setState({ categoryText: '' });
  };

  private getFilteredCategories = () => {
    const { categoryText } = this.state;
    const { categories } = this.props;
    let result: Category[] = [];
    result = categories.filter((category) =>
      compareFilterStrings(categoryText, category.name)
    );

    return result;
  };

  private handleCategorySelectSearch = (categoryText: string) => {
    this.setState({ categoryText: categoryText.replace(/,/g, '') });
  };
}

const WrappedPOIForm = Form.create()(POIForm);

export default injectIntl(WrappedPOIForm, {
  withRef: true,
});
