import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import DealListPage from './DealListPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <DealListPage />
    </Root>
  );
  expect(wrappedComponent.find(DealListPage).length).toBe(1);
});
