import { Button, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { formItemLayout, tailFormItemLayout } from 'src/constants/formitem';
import messages from 'src/translations/default/messages';
import { Zone } from '../../types/response/Zone';

const FormItem = Form.Item;

interface OwnProps {
  defaultData?: Zone;
  saveButtonText?: string;
  onSubmit(zone: Zone): void;
}

const defaultProps = { saveButtonText: 'Guardar' };

type Props = OwnProps & FormComponentProps & InjectedIntlProps;

class ZoneForm extends React.Component<Props> {
  public static defaultProps = defaultProps;

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: Zone) => {
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
    if (
      this.props.defaultData &&
      prevProps.defaultData !== this.props.defaultData
    ) {
      this.updateFormValues(this.props.defaultData);
    }
  }

  public updateFormValues(zone: Zone) {
    const { name, description } = zone;
    this.props.form.setFieldsValue({ name, description });
  }

  public render() {
    const { saveButtonText } = this.props;
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;

    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>Información General</h3>
        <FormItem
          {...formItemLayout}
          label={intl.formatMessage(messages.zone.label.name)}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: intl.formatMessage(
                  messages.zone.validation.name.required
                ),
              },
            ],
          })(
            <Input
              placeholder={intl.formatMessage(messages.zone.placeholder.name)}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={intl.formatMessage(messages.zone.label.description)}>
          {getFieldDecorator('description', {
            rules: [],
          })(
            <Input
              placeholder={intl.formatMessage(
                messages.zone.placeholder.description
              )}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {saveButtonText}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedZoneForm = Form.create()(ZoneForm);

export default injectIntl(WrappedZoneForm, {
  withRef: true,
});
