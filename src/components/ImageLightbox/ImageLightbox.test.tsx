import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import ImageLightbox from './ImageLightbox';

test('Render ImageLightBox without crashing', () => {
  const wrapper = mount(
    <Root>
      <ImageLightbox images={['http://via.placeholder.com/500x500']} />
    </Root>
  );
  expect(wrapper.find(ImageLightbox).length).toBe(1);
  expect(wrapper.find('img').length).toBe(1);
});
