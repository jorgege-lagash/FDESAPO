import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import FeaturedSpaceForm from './FeaturedSpaceForm';

const defaultData = {
  id: 1,
  mallId: 1,
  name: 'Test',
  active: true,
  created: '01-01-2019',
  modified: '01-01-2019',
};

const featureSpaceTypes = [
  {
    id: 1,
    name: 'Event',
  },
  {
    id: 2,
    name: 'Kiosk',
  },
];

const submit = () => undefined;
test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <FeaturedSpaceForm
        defaultData={defaultData}
        onSubmit={submit}
        currentLang={'es'}
        featureSpaceTypes={featureSpaceTypes}
      />
    </Root>
  );
  expect(wrapper.find(FeaturedSpaceForm).length).toBe(1);
});
