import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import UpdateMallPage from './UpdateMallPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <UpdateMallPage />
    </Root>
  );
  expect(wrappedComponent.find(UpdateMallPage).length).toBe(1);
});
