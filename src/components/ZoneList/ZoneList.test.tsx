import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { Zone } from 'src/types/response/Zone';
import { ZoneList } from './ZoneList';

const zones: Zone[] = [
  {
    id: 1,
    name: 'Maipu',
    description: 'mock description',
    mallId: 1,
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
  },
  {
    id: 2,
    name: 'Arauco br',
    description: 'mock description',
    mallId: 1,
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
  },
];

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <ZoneList zones={zones} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(2);
});
