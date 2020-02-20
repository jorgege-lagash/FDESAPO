import React from 'react';

import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';
import { ImageInput } from '../ImageInput/ImageInput';

interface OwnProps extends FormComponentProps {
  onChange: (data: any) => void;
}

type Props = OwnProps & FeaturedSpaceTranslationFormProps & InjectedIntlProps;
class CustomForm extends React.Component<Props> {
  public render() {
    const { intl, pictureFile } = this.props;
    const { getFieldDecorator } = this.props.form;
    const dimesion = { width: 1000, height: 304 };
    const maxSize = 2;
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage(messages.featuredSpace.label.picture)}>
          {getFieldDecorator('pictureFile', {
            rules: [],
          })(
            <ImageInput
              defautlImagePreviewUrl={pictureFile.url}
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
        </Form.Item>
      </Form>
    );
  }
}
const FeaturedSpaceForm = injectIntl(CustomForm, {
  withRef: true,
});
export const FeaturedSpaceTranslationForm = Form.create<Props>({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      pictureFile: Form.createFormField({
        ...props.pictureFile,
        value: props.pictureFile.value,
      }),
    };
  },
  onValuesChange(_, values) {
    return values;
  },
})(FeaturedSpaceForm);
