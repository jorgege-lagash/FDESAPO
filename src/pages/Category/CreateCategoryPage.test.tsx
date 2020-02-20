import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import CreateCategoryPage from './CreateCategoryPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <CreateCategoryPage />
    </Root>
  );
  expect(wrappedComponent.find(CreateCategoryPage).length).toBe(1);
});
