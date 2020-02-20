import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import { User } from 'src/types/response/User';
import RightContent from './RightContent';

const userData: User = {
  id: 1,
  username: 'superadmin',
  email: 'superadmin@email.com',
  firstName: 'string',
  lastName: 'string',
};
test('renders without crashing', () => {
  const onclick = () => undefined;
  const wrapper = mount(
    <Root>
      <RightContent
        currentUser={userData}
        isLoadingSession={false}
        onMenuClick={onclick}
      />
    </Root>
  );

  expect(wrapper.find(RightContent).length).toBe(1);
});
