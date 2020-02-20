import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import PoiListPage from './PoiListPage';

it('renders without crashing', () => {
  const wrappedComponent = mount(
    <Root>
      <PoiListPage />
    </Root>
  );
  expect(wrappedComponent.find(PoiListPage).length).toBe(1);
});
