import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import { prepareToTestQuill } from 'src/utils/test.utils';
import TermsOfServicePage from './TermsOfServicePage';

beforeAll(() => {
  prepareToTestQuill();
});
test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <TermsOfServicePage />
    </Root>
  );
  expect(wrapper.find(TermsOfServicePage).length).toBe(1);
});
