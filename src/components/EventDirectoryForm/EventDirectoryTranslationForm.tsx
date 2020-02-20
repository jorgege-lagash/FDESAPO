import React from 'react';

import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { EventDirectoryTranslationFormProps } from 'src/types/TranslationForm';
import { ImageInput } from '../ImageInput/ImageInput';

interface OwnProps extends FormComponentProps {
  onChange: (data: any) => void;
}

type Props = OwnProps & EventDirectoryTranslationFormProps & InjectedIntlProps;
class CustomForm extends React.Component<Props> {
  public render() {
    const { intl, pictureFile } = this.props;
    const { getFieldDecorator } = this.props.form;
    const dimesion = { width: 184, height: 184 };
    const maxSize = 2;
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage(messages.event.label.name)}>
          {getFieldDecorator('name', {
            rules: [],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage(messages.event.label.description)}>
          {getFieldDecorator('description', {
            rules: [],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage(messages.event.label.picture)}>
          {getFieldDecorator('pictureFile', {
            rules: [],
          })(
            <ImageInput
              defautlImagePreviewUrl={pictureFile.url}
              dimesion={dimesion}
              messageSize={intl.formatMessage(messages.validation.maxSize, {
                maxSize,
              })}
              square={true}
              messageSquare={intl.formatMessage(
                messages.validation.square,
                dimesion
              )}
            />
          )}
        </Form.Item>
      </Form>
    );
  }
}
const EventDirectoryForm = injectIntl(CustomForm, {
  withRef: true,
});
export const EventDirectoryTranslationForm = Form.create<Props>({
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
      pictureFile: Form.createFormField({
        ...props.pictureFile,
        value: props.pictureFile.value,
      }),
    };
  },
  onValuesChange(_, values) {
    return values;
  },
})(EventDirectoryForm);
