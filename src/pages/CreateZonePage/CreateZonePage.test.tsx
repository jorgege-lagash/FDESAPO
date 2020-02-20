import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import CreateZonePage from './CreateZonePage';

const defaultState = {
  session: {
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
  malls: {
    selectedMall: 1,
  },
  zones: {
    zones: false,
    isLoading: false,
    error: null,
  },
};
test('renders without crashing', () => {
  const wrapper = mount(
    <Root initialState={defaultState}>
      <CreateZonePage />
    </Root>
  );

  expect(wrapper.find(CreateZonePage).length).toBe(1);
});
