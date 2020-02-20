import React from 'react';

import { mount } from 'enzyme';
import { Route } from 'react-router';
import Root from 'src/Root';
import ZoneRoutes from './ZoneRoutes';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <Route component={ZoneRoutes} />
    </Root>
  );
  expect(wrappedComponent.find(ZoneRoutes).length).toBe(1);
});
