import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EditFeaturedSpacePage from './EditFeaturedSpacePage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EditFeaturedSpacePage />
    </Root>
  );
  expect(wrappedComponent.find(EditFeaturedSpacePage).length).toBe(1);
});
