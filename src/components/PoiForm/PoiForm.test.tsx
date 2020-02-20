import * as React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { Category } from 'src/types/response/Category';
import { Channel } from 'src/types/response/Channel';
import { FileDTO } from 'src/types/response/FileDTO';
import { Poi } from 'src/types/response/POI';
import { PoiState } from 'src/types/response/PoiState';
import { PoiType } from 'src/types/response/PoiType';
import { PwPoi } from 'src/types/response/PwPoi';
import { Tag } from 'src/types/response/Tag';
import { prepareToTestQuill } from 'src/utils/test.utils';
import PoiForm from './PoiForm';

beforeAll(() => {
  prepareToTestQuill();
});
let wrapped: any;
const mallId = 1;
const poi: Poi = {
  id: 1,
  name: 'Parque Otrauco',
  description: 'This is a mall',
  mallId,
  suc: '2',
  active: true,
  hasTouristDiscount: true,
  categories: [],
  tags: [],
};

const tags: Tag[] = [
  {
    id: 1,
    name: 'tag 1',
    mallId,
    languageId: 1,
  },
  {
    id: 2,
    name: 'tag 2',
    mallId,
    languageId: 1,
  },
  {
    id: 3,
    name: 'tag 3',
    mallId,
    languageId: 1,
  },
  {
    id: 4,
    name: 'tag 4',
    mallId,
    languageId: 1,
  },
];

const categories: Category[] = [
  {
    id: 1,
    name: 'category 1',
    urlLanding: '',
    icon: 'test',
    mallId,
    poiTypeId: 1,
  },
  {
    id: 2,
    name: 'category 2',
    icon: 'test',
    urlLanding: '',
    mallId,
    poiTypeId: 1,
  },
  {
    id: 3,
    name: 'category 3',
    icon: 'test',
    urlLanding: '',
    mallId,
    poiTypeId: 1,
  },
];

const channels: Channel[] = [
  {
    id: 1,
    name: 'channel 1',
    mallId,
  },
  {
    id: 2,
    name: 'channel 2',
    mallId,
  },
  {
    id: 3,
    name: 'channel 3',
    mallId,
  },
  {
    id: 4,
    name: 'channel 4',
    mallId,
  },
];

const poiTypes: PoiType[] = [
  {
    id: 1,
    name: 'channel 1',
  },
  {
    id: 2,
    name: 'channel 2',
  },
  {
    id: 3,
    name: 'channel 3',
  },
  {
    id: 4,
    name: 'channel 4',
  },
];

const pwPois: PwPoi[] = [
  {
    id: 1,
    name: 'pwpoi 1',
    floorId: 1,
    suc: '',
    level: 1,
    externalId: 1,
    buildingId: 1,
  },
  {
    id: 2,
    name: 'pwpoi 2',
    floorId: 1,
    suc: '',
    level: 1,
    externalId: 1,
    buildingId: 1,
  },
  {
    id: 3,
    name: 'pwpoi 3',
    floorId: 1,
    suc: '',
    level: 1,
    externalId: 1,
    buildingId: 1,
  },
] as PwPoi[];

const poiStates: PoiState[] = [
  {
    id: 1,
    name: 'Habilitado',
  },
  {
    id: 2,
    name: 'Deshabilitado',
  },
  {
    id: 3,
    name: 'En Remodelación',
  },
  {
    id: 4,
    name: 'Próximamente',
  },
  {
    id: 5,
    name: 'Borrador',
  },
] as PoiState[];

const logoData: FileDTO = {
  id: 1,
  name: 'logo.png',
  url: 'https://logopoi.png',
  contentType: 'image/png',
  uploaderId: 1,
  fileCategoryId: 3,
} as FileDTO;

const handleSubmit = () => undefined;
const handleCancelAction = () => undefined;

beforeEach(() => {
  wrapped = mount(
    <Root>
      <PoiForm
        isLoadingCategories={false}
        defaultData={poi}
        categories={categories}
        tags={tags}
        channels={channels}
        poiTypes={poiTypes}
        pwPois={pwPois}
        isLoadingPwPois={false}
        onSubmit={handleSubmit}
        onCancelAction={handleCancelAction}
        currentLang={'es'}
        defaultDiscountData={null}
        discountId={0}
        pwPoiById={{}}
        poiStates={poiStates}
        logoData={logoData}
      />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('renders without crashing', () => {
  expect(wrapped.find(PoiForm).length).toEqual(1);
});
