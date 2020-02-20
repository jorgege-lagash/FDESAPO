import { mount } from 'enzyme';
import React from 'react';

import Root from 'src/Root';
import { FormatedDeal } from 'src/types/response/Deal';
import { Poi } from 'src/types/response/POI';
import { DealList } from './DealList';

const poi: Poi = {
  id: 1,
  mallId: 1,
  suc: null,
  active: true,
  floor: 1,
  poiTypeId: 1,
  poiStateId: 1,
  hasTouristDiscount: true,
  hasDeals: true,
  name: 'Poi example',
  description: 'Poi example Des',
  categories: [],
  tags: [],
};

const deals: FormatedDeal[] = [
  {
    id: 1,
    mallId: 1,
    description: 'description',
    poi,
    title: 'title',
    state: 'scheduled',
    displayStartDate: '2019-06-10',
    displayEndDate: '2019-06-17',
  },
  {
    id: 2,
    mallId: 1,
    poi,
    state: 'scheduled',
    description: 'description',
    title: 'title',
    displayStartDate: '2019-06-16',
    displayEndDate: '2019-06-19',
  },
];

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <DealList deals={deals} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(2);
});
