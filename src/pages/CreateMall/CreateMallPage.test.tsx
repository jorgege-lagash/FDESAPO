import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import CreateMallPage from './CreateMallPage';

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
};
test('renders without crashing', () => {
  const wrapper = mount(
    <Root initialState={defaultState}>
      <CreateMallPage />
    </Root>
  );

  expect(wrapper.find(CreateMallPage).length).toBe(1);
});
