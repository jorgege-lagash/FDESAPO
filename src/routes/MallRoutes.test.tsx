import React from 'react';

import { mount } from 'enzyme';
import { Route } from 'react-router';
import Root from 'src/Root';
import MallRoutes from './MallRoutes';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <Route component={MallRoutes} />
    </Root>
  );
  expect(wrappedComponent.find(MallRoutes).length).toBe(1);
});
