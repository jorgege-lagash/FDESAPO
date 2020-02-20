import { mount } from 'enzyme';
import * as React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import CenteredContentLayout from '../../layouts/CenteredContentLayout';
import Root from '../../Root';
import LoginPage from './LoginPage';

const initialState = {
  session: {
    isAuthenticated: false,
  },
  locale: {
    lang: 'es',
  },
};

let wrapped: any;

beforeEach(() => {
  wrapped = mount(
    <Root initialState={initialState}>
      <LoginPage />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the LoginPage without crashing', () => {
  expect(wrapped.find(LoginPage).length).toEqual(1);
});

it('renders a CenteredContent Layout without crashing', () => {
  expect(wrapped.find(LoginPage).find(CenteredContentLayout).length).toEqual(1);
});

it('renders a LoginForm without crashing', () => {
  expect(wrapped.find(LoginForm).length).toEqual(1);
});
