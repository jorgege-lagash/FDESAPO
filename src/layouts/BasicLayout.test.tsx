import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import Root from '../Root';
import { BasicLayout } from './BasicLayout';

let wrapped: ShallowWrapper;

beforeEach(() => {
  wrapped = shallow(
    <Root>
      <BasicLayout />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the Basic Layout without crashing', () => {
  expect(wrapped.find(BasicLayout).length).toEqual(1);
});
