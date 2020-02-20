import { mount } from 'enzyme';
import * as React from 'react';
import Exception404 from './404';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(<Exception404 />);
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the Exception404 Component without crashing', () => {
  expect(wrapped.find(Exception404).length).toEqual(1);
});
