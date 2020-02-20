import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from 'src/translations/default/messages';
import * as styles from './LoginForm.less';

const FormItem = Form.Item;

interface FormProps {
  user: string;
  password: string;
  remember: boolean;
}

interface OwnProps {
  loginAction(user: string, password: string, remember: boolean): void;
}

type loginFormPropsWithSoreProps = OwnProps &
  FormComponentProps &
  InjectedIntlProps;

class LoginForm extends React.Component<loginFormPropsWithSoreProps> {
  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: FormProps) => {
      if (!err) {
        const { user, password, remember } = values;
        return this.props.loginAction(user, password, remember);
      }
      return false;
    });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    const intl = this.props.intl;

    return (
      <Form onSubmit={this.handleSubmit} className={styles.LoginForm}>
        <FormItem className={styles.loginInput}>
          {getFieldDecorator('user', {
            rules: [
              {
                required: true,
                message: intl.formatMessage(messages.login.emailEmpty),
              },
              {
                type: 'email',
                message: intl.formatMessage(messages.login.emailInvalid),
              },
            ],
          })(
            <Input
              prefix={
                <Icon type="user" style={{ color: 'rgba(0, 0, 0, 0.5)' }} />
              }
              type="text"
              placeholder={intl.formatMessage(
                messages.login.usernamePlaceholder
              )}
            />
          )}
        </FormItem>
        <FormItem className={styles.loginInput}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: intl.formatMessage(messages.login.passwordError),
              },
            ],
          })(
            <Input
              prefix={
                <Icon type="lock" style={{ color: 'rgba(0, 0, 0, 0.5)' }} />
              }
              type="password"
              placeholder={intl.formatMessage(
                messages.login.passwordPlaceholder
              )}
            />
          )}
        </FormItem>
        <FormItem className={styles.loginBottom}>
          {getFieldDecorator('remember', {
            initialValue: true,
            valuePropName: 'checked',
          })(
            <Checkbox className={styles.rememberCheckbox}>
              {intl.formatMessage(messages.login.rememberMe)}
            </Checkbox>
          )}
          <Button
            type="primary"
            htmlType="submit"
            className={styles.loginFormButton}>
            {intl.formatMessage(messages.login.logInButton)}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default injectIntl(WrappedLoginForm, {
  withRef: true,
});
