import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { Poi } from 'src/types/response/POI';
import { PoiList } from './PoiList';

const pois: Poi[] = [
  {
    id: 1,
    poisPhunware: [],
    mallId: 1,
    suc: 'S200',
    active: true,
    categories: [],
    facebook: 'https://www.facebook.com/adidas',
    instagram: 'https://www.instagram.com/adidas/?hl=en',
    website: 'https://www.adidas.com/us',
    telephone: '+56 2 2743 2809',
    created: '2018-12-06T20:18:40.000Z',
    modified: '2018-12-06T20:18:40.000Z',
    logo: {
      id: 84,
      name: '20181205_141751.jpg',
      url:
        'https://parque-arauco.s3.us-west-2.amazonaws.com/customerPicture/77cacdd6-9bf0-4dd2-9201-63200c982f01.jpg',
      contentType: 'image/jpeg',
      uploaderId: 291,
      uploaderType: 'customer',
      fileCategoryId: 1,
      mallId: 1,
      created: '2018-12-05T20:18:01.139Z',
      modified: '2018-12-05T20:18:01.139Z',
    },
    name: 'Adidas',
    tags: [],
    location: '2do Piso, junto a Tienda de Ropa X.',
    description:
      'Deportistas de todos los niveles pueden encontrar en Adidas todo lo que necesitan para practicar su deporte favorito. La más completa línea de artículos, vestuario deportivo y outdoor para ti.',
  },
  {
    id: 2,
    poisPhunware: [],
    mallId: 1,
    suc: null,
    active: true,
    categories: [],
    facebook: '',
    instagram: '',
    website: 'https://tomy.com/',
    telephone: '+2 231231231 123',
    created: '2018-12-06T23:35:16.000Z',
    modified: '2018-12-06T23:35:16.000Z',
    logo: {
      id: 86,
      name: 'tomi.jpg',
      url:
        'https://tomy.com/sites/default/files/content/en_US/global/site_logos/TOMY_blue_logo.png',
      contentType: 'image/jpg',
      uploaderId: 1,
      uploaderType: 'user',
      fileCategoryId: 3,
      mallId: 1,
      created: '2018-12-06T23:38:06.000Z',
      modified: '2018-12-06T23:38:06.000Z',
    },
    name: 'TOMY',
    tags: [],
    location: 'Segundo Piso Cerca de Tommy',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <PoiList pois={pois} categories={[]} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(pois.length);
});
