import React from 'react';

import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { CategoryTranslationFormProps } from 'src/types/TranslationForm';

interface OwnProps extends FormComponentProps {
  onChange: (data: any) => void;
}

type Props = OwnProps & CategoryTranslationFormProps & InjectedIntlProps;

const CategoryForm = Form.create<Props>({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        ...props.name,
        value: props.name.value,
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
        label={intl.formatMessage(messages.category.label.name)}>
        {getFieldDecorator('name', {
          rules: [{ required: false, message: 'name is required!' }],
        })(<Input />)}
      </Form.Item>
    </Form>
  );
});
export const CategoryTranslationForm = injectIntl(CategoryForm, {
  withRef: true,
});
