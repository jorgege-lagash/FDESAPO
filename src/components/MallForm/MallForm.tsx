import * as React from 'react';

import { Button, Form, Input, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from 'src/translations/default/messages';
import { Mall } from '../../types/Mall';

const FormItem = Form.Item;

interface OwnProps {
  defaultData?: Mall;
  onSubmit(mall: Mall): void;
}

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class MallForm extends React.Component<Props> {
  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: Mall) => {
      if (!err) {
        this.props.onSubmit(values);
      }
      return false;
    });
  };

  public componentDidMount() {
    if (this.props.defaultData) {
      this.updateFormValues(this.props.defaultData);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { defaultData } = this.props;
    if (defaultData && prevProps.defaultData !== defaultData) {
      this.updateFormValues(defaultData);
    }
  }

  public updateFormValues(mall: Mall) {
    const { name, stringId, buildingId, description } = mall;
    this.props.form.setFieldsValue({ name, stringId, buildingId, description });
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Editar Mall</h2>
        <FormItem
          {...formItemLayout}
          label={intl.formatMessage(messages.mall.label.name)}>
          {getFieldDecorator('name', {
            rules: [],
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

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Actualizar
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedMallForm = Form.create()(MallForm);

export default injectIntl(WrappedMallForm, {
  withRef: true,
});
