import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import Header from './index';
const initialState = {
  session: {
    isLoading: false,
    isAuthenticated: true,
    userData: {
      id: '64757dec-00b0-44eb-bd0a-affc649874ab',
      username: 'superadmin',
      email: 'superadmin@email.com',
      roles: ['admin', 'admin'],
      userId: 1,
      iat: 1542643316,
      exp: 1542646916,
      permissions: {},
    },
  },
  locale: {
    lang: 'es',
  },
};
it('renders without crashing', () => {
  const onToggle = () => {
    return;
  };
  const wrappedComponent = mount(
    <Root initialState={initialState}>
      <Header
        isMobile={false}
        collapsed={false}
        mobileLogo=""
        toggle={onToggle}
      />
    </Root>
  );
  expect(wrappedComponent.find(Header).length).toBe(1);
});
