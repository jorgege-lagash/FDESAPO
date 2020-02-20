import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EditDealPage from './EditDealPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EditDealPage />
    </Root>
  );
  expect(wrappedComponent.find(EditDealPage).length).toBe(1);
});
