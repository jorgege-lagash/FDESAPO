import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import EditPoiPage from './EditPoiPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <EditPoiPage />
    </Root>
  );
  expect(wrappedComponent.find(EditPoiPage).length).toBe(1);
});
