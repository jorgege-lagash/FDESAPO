import { mount } from 'enzyme';
import * as React from 'react';
import Exception500 from './500';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(<Exception500 />);
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the Exception500 Component without crashing', () => {
  expect(wrapped.find(Exception500).length).toEqual(1);
});
