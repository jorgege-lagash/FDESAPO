import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import CreatedEventDirectoryPage from './CreateEventDirectoryPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <CreatedEventDirectoryPage />
    </Root>
  );
  expect(wrappedComponent.find(CreatedEventDirectoryPage).length).toBe(1);
});
