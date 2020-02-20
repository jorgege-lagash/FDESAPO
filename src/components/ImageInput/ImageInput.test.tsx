import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import { ImageInput } from './ImageInput';

test('Render ImageLightBox without crashing', () => {
  const wrapper = mount(
    <Root>
      <ImageInput
        defautlImagePreviewUrl={'http://via.placeholder.com/500x500'}
      />
    </Root>
  );
  expect(wrapper.find(ImageInput).length).toBe(1);
  expect(wrapper.find('input').length).toBe(1);
});
