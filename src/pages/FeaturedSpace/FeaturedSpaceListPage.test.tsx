import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import FeaturedSpaceListPage from './FeaturedSpaceListPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <FeaturedSpaceListPage />
    </Root>
  );
  expect(wrappedComponent.find(FeaturedSpaceListPage).length).toBe(1);
});
