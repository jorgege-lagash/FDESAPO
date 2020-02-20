import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EventDirectoryListPage from './EventDirectoryListPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EventDirectoryListPage />
    </Root>
  );
  expect(wrappedComponent.find(EventDirectoryListPage).length).toBe(1);
});
