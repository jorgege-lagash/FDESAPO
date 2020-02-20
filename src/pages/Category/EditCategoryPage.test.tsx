import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EditCategoryPage from './EditCategoryPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EditCategoryPage />
    </Root>
  );
  expect(wrappedComponent.find(EditCategoryPage).length).toBe(1);
});
