import React from 'react';

import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, fullWidthItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { MallTranslationFormProps } from 'src/types/TranslationForm';
import FormatedHtmlEditor from '../FormatedHtmlEditor/FormatedHtmlEditor';

interface OwnProps extends FormComponentProps {
  onChange: (data: any) => void;
}

type Props = OwnProps & MallTranslationFormProps & InjectedIntlProps;

const MallForm = Form.create<Props>({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      description: Form.createFormField({
        ...props.description,
        value: props.description.value,
      }),

      information: Form.createFormField({
        ...props.information,
        value: props.information.value,
      }),
    };
  },
  onValuesChange(_, values) {
    return values;
  },
})((props: Props) => {
  const { intl } = props;
  const { getFieldDecorator } = props.form;
  return (
    <Form>
      <Form.Item
        {...formItemLayout}
        label={intl.formatMessage(messages.mall.label.description)}>
        {getFieldDecorator('description', {
          rules: [],
        })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
      </Form.Item>
      <Form.Item
        {...fullWidthItemLayout}
        label={intl.formatMessage(messages.mall.label.information)}>
        {getFieldDecorator('information', {
          initialValue: '',
          rules: [],
        })(
          <FormatedHtmlEditor
            placeholder={intl.formatMessage(messages.mall.label.information)}
          />
        )}
      </Form.Item>
    </Form>
  );
});
export const MallTranslationForm = injectIntl(MallForm, {
  withRef: true,
});
