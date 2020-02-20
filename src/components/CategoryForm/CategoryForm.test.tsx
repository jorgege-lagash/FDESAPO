import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import CategoryForm from './CategoryForm';

const defaultData = {
  id: 1,
  mallId: 1,
  icon: 'test',
  urlLanding: '',
  poiTypeId: 2,
  name: 'computadoras',
};

const poiTypes = [
  {
    id: 1,
    name: 'Otro',
  },
  {
    id: 2,
    name: 'Tiendas',
  },
  {
    id: 3,
    name: 'Utilidades',
  },
];

const submit = () => undefined;
test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <CategoryForm
        defaultData={defaultData}
        onSubmit={submit}
        poiTypes={poiTypes}
        currentLang={'es'}
      />
    </Root>
  );
  expect(wrapper.find(CategoryForm).length).toBe(1);
});
