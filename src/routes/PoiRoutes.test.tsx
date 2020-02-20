import React from 'react';

import { mount } from 'enzyme';
import { Route } from 'react-router';
import Root from 'src/Root';
import PoiRoutes from './PoiRoutes';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <Route component={PoiRoutes} />
    </Root>
  );
  expect(wrappedComponent.find(PoiRoutes).length).toBe(1);
});
