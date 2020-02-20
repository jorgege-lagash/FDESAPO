import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import MapPocPage from './MapPocPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <MapPocPage />
    </Root>
  );
  expect(wrappedComponent.find(MapPocPage).length).toBe(1);
});
