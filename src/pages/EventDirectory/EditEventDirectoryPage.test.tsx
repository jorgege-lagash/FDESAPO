import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EditEventDirectoryPage from './EditEventDirectoryPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EditEventDirectoryPage />
    </Root>
  );
  expect(wrappedComponent.find(EditEventDirectoryPage).length).toBe(1);
});
