import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import { initialHistory } from 'src/store';
import EventDirectoryDetailPage from './EventDirectoryDetailPage';

it('renders without crashing', () => {
  initialHistory.push('/cms/mall/1/events/1/detail');
  const EnhancedComponent = RootHOC(EventDirectoryDetailPage);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(EventDirectoryDetailPage).length).toBe(1);
});
