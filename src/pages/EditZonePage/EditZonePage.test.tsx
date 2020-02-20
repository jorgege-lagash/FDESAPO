import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EditZonePage from './EditZonePage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EditZonePage />
    </Root>
  );
  expect(wrappedComponent.find(EditZonePage).length).toBe(1);
});
