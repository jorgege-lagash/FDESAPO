import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import { initialHistory } from 'src/store';
import PoiDetailPage from './PoiDetailPage';

it('renders without crashing', () => {
  initialHistory.push('/cms/mall/1/pois/1/detail');
  const EnhancedComponent = RootHOC(PoiDetailPage);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(PoiDetailPage).length).toBe(1);
});
