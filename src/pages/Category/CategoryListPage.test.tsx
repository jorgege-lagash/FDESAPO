import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import CategoryListPage from './CategoryListPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <CategoryListPage />
    </Root>
  );
  expect(wrappedComponent.find(CategoryListPage).length).toBe(1);
});
