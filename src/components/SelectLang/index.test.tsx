import * as React from 'react';

import { Dropdown } from 'antd';
import { mount } from 'enzyme';
import Root from 'src/Root';
import SelectLang from './index';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(
    <Root>
      <SelectLang className="test" />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the SelectMall Component without crashing', () => {
  expect(wrapped.find(SelectLang).length).toEqual(1);
  expect(wrapped.find(Dropdown).length).toEqual(1);
});
