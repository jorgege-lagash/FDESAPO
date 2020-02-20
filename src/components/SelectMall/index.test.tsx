import * as React from 'react';

import { Select } from 'antd';
import { mount } from 'enzyme';
import Root from 'src/Root';
import SelectMall from './index';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(
    <Root>
      <SelectMall />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('renders without crashing', () => {
  expect(wrapped.find(SelectMall).length).toEqual(1);
  expect(wrapped.find(Select).length).toEqual(1);
});
