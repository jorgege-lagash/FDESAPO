import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { Mall } from 'src/types/Mall';
import { MallList } from './MallList';

const malls: Mall[] = [
  {
    id: 1,
    name: 'Maipu',
    stringId: 'tst1',
    buildingId: 1,
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
    timezone: 'America/Santiago',
  },
  {
    id: 2,
    name: 'Arauco br',
    stringId: 'aCD',
    buildingId: 2,
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
    timezone: 'America/Santiago',
  },
];

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <MallList malls={malls} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(2);
});

test('filters mall by name', () => {
  const wrapper = mount(
    <Root>
      <MallList malls={malls} />
    </Root>
  );
  wrapper
    .find('i[title="Filter menu"]')
    .first()
    .simulate('click');
  const input = wrapper.find('.custom-filter-dropdown input');
  expect(input.length).toBe(2);
  input.first().simulate('change', { target: { value: 'maip' } });
  wrapper
    .find('.custom-filter-dropdown .ant-btn.ant-btn-primary')
    .first()
    .simulate('click');

  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(1);
  const highlightedText = rows.find('td .highlight');
  expect(highlightedText.first().text()).toEqual('Maip');
});
