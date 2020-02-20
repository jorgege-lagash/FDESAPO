import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { MapImageGenerator } from './MapImageGenerator';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <MapImageGenerator pois={[]} defaultImage={''} />
    </Root>
  );
  expect(wrappedComponent.find(MapImageGenerator).length).toBe(1);
});
