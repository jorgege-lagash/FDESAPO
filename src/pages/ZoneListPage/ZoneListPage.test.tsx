import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import ZoneListPage from './ZoneListPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <ZoneListPage />
    </Root>
  );
  expect(wrappedComponent.find(ZoneListPage).length).toBe(1);
});
