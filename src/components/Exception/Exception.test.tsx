import { mount } from 'enzyme';
import * as React from 'react';
import Exception from './Exception';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(<Exception backText="Volver a inicio" type={'404'} />);
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the Exception Component without crashing', () => {
  expect(wrapped.find(Exception).length).toEqual(1);
});
