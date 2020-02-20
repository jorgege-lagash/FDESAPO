import { createPwPoiFromPwPoiDTO } from './PwPoi';

const pwPoiMetadata = {
  category: 'category',
  pin_id: 'pin_id',
  local_id: 'local_id',
  poi_type_id: 'poi_type_id',
};

const pwLocation = {
  latitude: 1,
  longitude: 2,
};

const pwPoi = {
  zoomLevel: 1,
  description: 'text',
  isExit: true,
  isActive: true,
  floorId: 1,
  metaData: pwPoiMetadata,
  createdAt: '01-01-2019',
  customIconImageUrl: 'text',
  imageUrl: null,
  portalId: 'text',
  id: 1,
  updatedAt: '02-01-2019',
  annotation: null,
  isAccessible: true,
  level: 1,
  externalId: 1,
  buildingId: 1,
  maxZoomLevel: 5,
  poiType: 1,
  name: 'name',
  x: 11,
  y: 12,
  location: pwLocation,
  category: null,
};

const expectedResult = {
  id: 1,
  floorId: 1,
  suc: 'local_id',
  poiTypeId: undefined,
  level: 1,
  externalId: 1,
  buildingId: 1,
  name: 'name',
  location: { latitude: 1, longitude: 2 },
  customIconImageUrl: 'text',
};

test('getMallcategoriesArray returns an array of categories', () => {
  const result = createPwPoiFromPwPoiDTO(pwPoi);
  expect(result).toEqual(expectedResult);
});
