import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import messages from '../../translations/default/messages';
import LoginForm from './LoginForm';

let wrapped: any;

const defaultLoginAction = () => {
  return 1;
};

beforeEach(() => {
  const lang: string = 'es';
  wrapped = mount(
    <IntlProvider locale={lang} defaultLocale={lang} messages={messages}>
      <LoginForm loginAction={defaultLoginAction} />
    </IntlProvider>
  );
});

afterEach(() => {
  wrapped.unmount();
});

describe('Rendering Components', () => {
  it('renders the LoginForm Component without crashing', () => {
    expect(wrapped.find(LoginForm).length).toEqual(1);
  });

  it('renders the Ant Design Form Component without crashing', () => {
    expect(wrapped.find(Form).length).toEqual(1);
  });
});

describe('Ant Design Form Component body', () => {
  it('renders Form Items without crashing', () => {
    const formComponent = wrapped.find(Form);
    expect(formComponent.find(Form.Item)).toBeTruthy();
  });

  it('has 2 inputs, 1 checkbox and 1 submit button', () => {
    const formComponent = wrapped.find(Form);
    expect(formComponent.find(Input).length).toEqual(2);

    expect(
      formComponent
        .find(Input)
        .at(0)
        .prop('type')
    ).toEqual('text');

    expect(
      formComponent
        .find(Input)
        .at(1)
        .prop('type')
    ).toEqual('password');

    expect(formComponent.find(Checkbox).props().checked).toBeTruthy();

    expect(formComponent.find(Button).prop('type')).toEqual('primary');
  });

  it('renders Input components with their respective Icon components', () => {
    const formComponent = wrapped.find(Form);
    const inputs = formComponent.find(Input);

    inputs.forEach((node: any) => {
      expect(node.find(Icon)).toBeTruthy();
    });
  });

  it('can check and uncheck the Checkbox Component', () => {
    const formComponent = wrapped.find(Form);
    const checkbox = formComponent.find(Checkbox);

    expect(checkbox.props().checked).toBeTruthy();

    checkbox.props().checked = false;

    expect(checkbox.props().checked).toBeFalsy();
  });
});

describe('User login', () => {
  it('submits the form if credentials are provided', () => {
    const formComponent = wrapped.find(Form);
    const fakeEvent = {
      preventDefault: () => 'prevent Default',
    };

    formComponent.simulate('submit', fakeEvent);

    const result = formComponent.find('.ant-form-item-control').at(2);

    expect(result.hasClass('has-success')).toBeTruthy();
  });
});
