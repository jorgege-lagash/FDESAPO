import React from 'react';

import { mount } from 'enzyme';
import { Route } from 'react-router';
import Root from 'src/Root';
import DealRoutes from './DealRoutes';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <Route component={DealRoutes} />
    </Root>
  );
  expect(wrappedComponent.find(DealRoutes).length).toBe(1);
});
