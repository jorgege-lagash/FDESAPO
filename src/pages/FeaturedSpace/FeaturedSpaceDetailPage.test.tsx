import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import { initialHistory } from 'src/store';
import FeaturedSpaceDetailPage from './FeaturedSpaceDetailPage';

it('renders without crashing', () => {
  initialHistory.push('/cms/mall/1/featured-space/1/detail');
  const EnhancedComponent = RootHOC(FeaturedSpaceDetailPage);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(FeaturedSpaceDetailPage).length).toBe(1);
});
