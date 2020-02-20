import React from 'react';

import { Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from 'src/translations/default/messages';
import { PoiTranslationFormProps } from 'src/types/TranslationForm';
import { ImageInput } from '../ImageInput/ImageInput';

interface OwnProps extends FormComponentProps {
  onChange: (data: any) => void;
  hasTouristDiscount: boolean;
}

const dimension = { width: 184, height: 184 };

type Props = OwnProps & PoiTranslationFormProps & InjectedIntlProps;
class CustomForm extends React.Component<Props> {
  public get travelerDiscountFields() {
    const { intl, discountPicture, hasTouristDiscount } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        style={{
          display: hasTouristDiscount ? 'block' : 'none',
        }}>
        <h3>{intl.formatMessage(messages.store.label.discountTitle)}</h3>
        <Form.Item
          label={intl.formatMessage(messages.store.label.discountDescription)}>
          {getFieldDecorator('discountDescription', {
            rules: [],
          })(<Input.TextArea autosize={{ minRows: 4, maxRows: 6 }} />)}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage(messages.store.label.discountPicture)}>
          {getFieldDecorator('discountPicture', {
            rules: [],
          })(
            <ImageInput
              defautlImagePreviewUrl={discountPicture.url}
              dimesion={dimension}
              square={true}
              messageSquare={intl.formatMessage(
                messages.validation.square,
                dimension
              )}
            />
          )}
        </Form.Item>
      </div>
    );
  }

  public render() {
    const { intl, hasTouristDiscount } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={20}>
          <Col
            className="gutter-row"
            span={12}
            offset={hasTouristDiscount ? 0 : 6}>
            <h3>Detalles</h3>
            <Form.Item label={intl.formatMessage(messages.store.label.name)}>
              {getFieldDecorator('name', {
                rules: [{ required: false, message: 'name is required!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage(messages.store.label.description)}>
              {getFieldDecorator('description', {
                rules: [
                  { required: false, message: 'description is required!' },
                ],
              })(<Input.TextArea autosize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            {this.travelerDiscountFields}
          </Col>
        </Row>
      </Form>
    );
  }
}
const TranslationForm = injectIntl(CustomForm, {
  withRef: true,
});
export const PoiTranslationForm = Form.create<Props>({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        ...props.name,
        value: props.name.value,
      }),
      description: Form.createFormField({
        ...props.description,
        value: props.description.value,
      }),
      discountPicture: Form.createFormField({
        ...props.discountPicture,
        url: props.discountPicture.url,
        value: props.discountPicture.value,
      }),
      discountDescription: Form.createFormField({
        ...props.discountDescription,
        value: props.discountDescription.value,
      }),
    };
  },
  onValuesChange(_, values) {
    return values;
  },
})(TranslationForm);
