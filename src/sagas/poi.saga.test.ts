import { normalize } from 'normalizr';
import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { poiListSchema } from 'src/schemas/poi.schema';
import { PageData } from 'src/types/response/PaginatedData';
import { Poi } from 'src/types/response/POI';
import { actions } from '../actions/poi.action';
import * as Api from '../api';
import { fetchPois } from './poi.saga';

const basepoi: Poi = {
  id: 1,
  mallId: 1,
  suc: 'S200',
  active: true,
  categories: [],
  tags: [],
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
  location: '2do Piso, junto a Tienda de Ropa X.',
  description:
    'Deportistas de todos los niveles pueden encontrar en Adidas todo lo que necesitan para practicar su deporte favorito. La más completa línea de artículos, vestuario deportivo y outdoor para ti.',
};
const pois: Poi[] = [
  basepoi,
  {
    ...basepoi,
    id: 2,
  },
];

describe('fetchPois', () => {
  const mallId = 1;
  const pageNumber = 1;
  const generator = cloneableGenerator(fetchPois)(
    actions.fetchPoiList(mallId, pageNumber)
  );
  const pageData: PageData<Poi> = {
    data: pois,
    pagination: {
      items: 2,
      page: 1,
      totalPages: 1,
      totalItems: 2,
    },
  };
  test("call's poi.fetch", () => {
    expect(generator.next().value).toEqual(
      call(Api.poi.fetchAll, mallId, pageNumber, 10, undefined, undefined)
    );
  });

  test('put fetchSuccess with correct payload.', () => {
    const clone = generator.clone();
    const { entities, result: poiIds } = normalize(pois, poiListSchema);
    expect(JSON.stringify(clone.next(pageData).value)).toEqual(
      JSON.stringify(
        put(actions.fetchPoiListSuccess(poiIds, entities, 2, 1, 10))
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put fetchFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.fetchPoiListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});
