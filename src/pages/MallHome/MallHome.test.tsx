import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import MallHome from './MallHome';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <MallHome />
    </Root>
  );
  expect(wrappedComponent.find(MallHome).length).toBe(1);
});
