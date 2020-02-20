import { notification } from 'antd';
import { normalize } from 'normalizr';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import {
  actions,
  CreatePoiRequestAction,
  FetchAllSucCodesAction,
  FetchPoiAction,
  FetchPoiListAction,
  types,
  UpdatePoiRequestAction,
} from 'src/actions/poi.action';
import { actions as tagActions } from 'src/actions/tag.action';
import { actions as travelerDiscountActions } from 'src/actions/traveler-discount.action';
import * as api from 'src/api';
import { poiListSchema } from 'src/schemas/poi.schema';
import { getMallById } from 'src/selectors/mall.selector';
import { getPoiById } from 'src/selectors/poi.selector';
import { getPwPoiById } from 'src/selectors/pwpoi.selector';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Mall } from 'src/types/Mall';
import { FileCategory, UploadedFileResult } from 'src/types/response/FileDTO';
import { PageData, PwPageData } from 'src/types/response/PaginatedData';
import { Poi } from 'src/types/response/POI';
import { PwPoi, PwPoiDTO } from 'src/types/response/PwPoi';
import { Tag } from 'src/types/response/Tag';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import {
  PoiTranslationFormProps,
  TravelerDiscountTranslationProps,
} from 'src/types/TranslationForm';
import {
  getIdListDiff,
  getTranslationValueObject,
  parseObjectListIds,
} from 'src/utils';
import { CustomHeaders } from 'src/utils/request';

const getSucCodeListFromPwPoiList = (data: PwPoiDTO[]): string[] => {
  return data.map((p: PwPoiDTO) => p.metaData.local_id || '').filter((s) => s);
};

const getTravelerDiscountTranslations = (
  translations: TypedLooseObject<PoiTranslationFormProps>
) => {
  return Object.keys(translations).reduce(
    (acc, lang) => ({
      ...acc,
      [lang]: {
        discountPicture: translations[lang].discountPicture,
        description: translations[lang].discountDescription,
      },
    }),
    {} as TypedLooseObject<TravelerDiscountTranslationProps>
  );
};

export function* fetchPois(action: FetchPoiListAction) {
  const { mallId, page, pageSize, query } = action.payload;
  try {
    const fetchMallResponse: PageData<Poi> = yield call(
      api.poi.fetchAll,
      mallId,
      page,
      pageSize,
      undefined,
      query
    );
    const { pagination } = fetchMallResponse;
    const { entities, result: mallIds } = normalize(
      fetchMallResponse.data,
      poiListSchema
    );
    yield put(
      actions.fetchPoiListSuccess(
        mallIds,
        entities,
        pagination.totalItems,
        page,
        pageSize
      )
    );
  } catch (e) {
    yield put(actions.fetchPoiListFailure(e));
  }
}

export function* createMallPoi(action: CreatePoiRequestAction) {
  try {
    const { mallId, poi, categories, tags, translations } = action.payload;
    const { ids: tagIds, newTags } = tags;
    const {
      discountDescription,
      discount,
      discountPicture,
      logoFile,
      poiImage,
      ...poiData
    } = poi;
    delete poiData.tags;
    const hasTouristDiscount = poiData.hasTouristDiscount;

    const response: Poi = yield call(api.poi.create, mallId, poiData);
    const poiId = response.id;
    const discountData: TravelerDiscount = {
      id: 0,
      mallId,
      poiId,
      discount,
      description: discountDescription,
      pictureFile: discountPicture,
    };
    const travelerDiscountTranslations = getTravelerDiscountTranslations(
      translations
    );

    if (hasTouristDiscount) {
      yield put(
        travelerDiscountActions.createEntity(
          mallId,
          discountData,
          travelerDiscountTranslations
        )
      );
    }

    const { entities, result: poiIds } = normalize([response], poiListSchema);
    const pwPoiIds = poi.poisPhunware || [];
    yield put(actions.createPoiSuccess(poiIds, entities));
    yield all([
      call(linkTags, mallId, poiId, tagIds),
      call(createTags, mallId, poiId, newTags),
      call(linkCategories, mallId, poiId, categories),
      call(linkPwpois, mallId, poiId, pwPoiIds),
      call(uploadFile, mallId, poiId, FileCategory.poiLogo, logoFile),
      call(
        uploadScreenshotFile,
        mallId,
        poiId,
        FileCategory.poiScreenshot,
        poiImage
      ),
      call(translatePoiLanguages, mallId, poiId, translations),
      call(linkChannels, mallId, poiId, parseObjectListIds(poi.channels || [])),
    ]);
    yield put(actions.fetchPoi(mallId, poiId));
  } catch (e) {
    yield put(actions.createPoiFailure(e));
  }
}

export function* updateMallPoi(action: UpdatePoiRequestAction) {
  try {
    const { mallId, data, id, translations, tags } = action.payload;
    const oldPoi: Poi = yield select(getPoiById, id.toString());

    const categoryListDiff = getIdListDiff(oldPoi.categories, data.categories);
    const channelListDiff = getIdListDiff(oldPoi.channels, data.channels);
    const tagListDiff = getIdListDiff(
      parseObjectListIds(oldPoi.tags),
      tags.ids
    );

    const {
      discount = '0',
      discountDescription = '',
      discountPicture,
      discountId,
      logoFile,
      poiImage,
      tags: dataTags,
      ...poiData
    } = data;
    const hasTouristDiscount = poiData.hasTouristDiscount;
    const discountData: TravelerDiscount = {
      id: discountId || 0,
      poiId: id,
      mallId,
      discount,
      description: discountDescription,
      pictureFile: discountPicture,
    };
    const travelerDiscountTranslations = getTravelerDiscountTranslations(
      translations
    );

    if (hasTouristDiscount) {
      yield put(
        travelerDiscountActions.updateEntity(
          mallId,
          discountData.id,
          discountData,
          travelerDiscountTranslations
        )
      );
    }

    const response: Poi = yield call(
      api.poi.update,
      mallId,
      id,
      poiData as Partial<Poi>
    );

    const { entities, result: poiIds } = normalize([response], poiListSchema);
    const pwPoiListDiff = getIdListDiff(oldPoi.poisPhunware, data.poisPhunware);
    const { newTags } = tags;
    yield put(actions.updatePoiSuccess(poiIds, entities));
    yield all([
      call(linkCategories, mallId, response.id, categoryListDiff.added),
      call(linkPwpois, mallId, response.id, pwPoiListDiff.added),
      call(unlinkCategories, mallId, response.id, categoryListDiff.removed),
      call(linkTags, mallId, response.id, tagListDiff.added),
      call(unlinkTags, mallId, response.id, tagListDiff.removed),
      call(createTags, mallId, response.id, newTags),
      call(unlinkPwpois, mallId, response.id, pwPoiListDiff.removed),
      call(uploadFile, mallId, response.id, FileCategory.poiLogo, logoFile),
      call(
        uploadScreenshotFile,
        mallId,
        response.id,
        FileCategory.poiScreenshot,
        poiImage
      ),
      call(translatePoiLanguages, mallId, response.id, translations),
      call(linkChannels, mallId, response.id, channelListDiff.added),
      call(unlinkChannels, mallId, response.id, channelListDiff.removed),
    ]);
    yield put(actions.fetchPoi(mallId, id));
  } catch (e) {
    yield put(actions.updatePoiFailure(e));
  }
}

function* translatePoiLanguages(
  mallId: number,
  poiId: number,
  translation: TypedLooseObject<PoiTranslationFormProps> = {}
) {
  const languageKeys = Object.keys(translation);
  for (const lang of languageKeys) {
    yield call(translatePoi, mallId, poiId, lang, translation[lang]);
  }
}

function* translatePoi(
  mallId: number,
  poiId: number,
  language: string,
  translation: PoiTranslationFormProps
) {
  try {
    const translationValues = getTranslationValueObject(translation as any);
    const data: Partial<Poi> = translationValues;
    const headers = { 'accept-language': language };
    yield call(api.poi.update, mallId, poiId, data, headers);
    yield put(actions.poiTranslateSuccess(mallId, poiId, language));
  } catch (error) {
    yield put(actions.poiTranslateFailure(mallId, poiId, language));
  }
}

function* uploadFile(
  mallId: number,
  poiId: number,
  fileCategory: FileCategory,
  file?: File
) {
  if (!file) {
    return;
  }
  try {
    const result: UploadedFileResult = yield call(
      api.file.handleFileUpload,
      mallId,
      file,
      fileCategory
    );
    yield call(api.poi.linkUploadedFile, mallId, poiId, result.id);
    yield put(actions.poiLogoUploadSuccess(mallId, poiId, result.id));
  } catch (error) {
    yield put(actions.poiLogoUploadFailure(mallId, poiId));
  }
}

function* uploadScreenshotFile(
  mallId: number,
  poiId: number,
  fileCategory: FileCategory,
  file?: File
) {
  if (!file) {
    return;
  }
  try {
    const result: UploadedFileResult = yield call(
      api.file.handleFileUpload,
      mallId,
      file,
      fileCategory
    );
    yield call(api.poi.linkScreenshot, mallId, poiId, result.id);
    yield put(actions.poiLogoUploadSuccess(mallId, poiId, result.id));
  } catch (error) {
    yield put(actions.poiLogoUploadFailure(mallId, poiId));
  }
}

function* linkCategories(
  mallId: number,
  poiId: number,
  categoryIds: number[] = []
) {
  for (const categoryId of categoryIds) {
    try {
      yield call(api.poi.linkCategory, mallId, poiId, categoryId);
    } catch (error) {
      yield put(
        actions.resourceLinkFailed(poiId, 'categories', categoryId, error)
      );
    }
  }
}

function* linkPwpois(
  mallId: number,
  poiId: number,
  pwpoisIds: number[] | string[] = []
) {
  for (const pwpoiId of pwpoisIds) {
    try {
      yield call(api.poi.linkPwPoi, mallId, poiId, pwpoiId);
    } catch (error) {
      const pwpoi: PwPoi = yield select(getPwPoiById, pwpoiId);
      notification.error({
        message: 'Error',
        description: `No se pudo enlazar  L${pwpoi.level}-${
          pwpoi.name
        }, posiblemente ya esta asignado a otra tienda`,
        duration: 10,
      });
      yield put(
        actions.resourceLinkFailed(poiId, 'pwpoi', pwpoiId as number, error)
      );
    }
  }
}

function* linkTags(mallId: number, poiId: number, tagIds: number[] = []) {
  yield all(tagIds.map((id) => call(linkTag, mallId, poiId, id)));
}

function* linkTag(mallId: number, poiId: number, tagId: number) {
  try {
    yield call(api.poi.linkTag, mallId, poiId, tagId);
  } catch (error) {
    yield put(actions.resourceLinkFailed(poiId, 'tags', tagId, error));
  }
}

function* unlinkTags(mallId: number, poiId: number, tagIds: number[] = []) {
  yield all(tagIds.map((id) => call(unlinkTag, mallId, poiId, id)));
}

function* unlinkTag(mallId: number, poiId: number, tagId: number) {
  try {
    yield call(api.poi.unlinkTag, mallId, poiId, tagId);
  } catch (error) {
    yield put(actions.resourceUnlinkFailed(poiId, 'tags', tagId));
  }
}

function* createTags(mallId: number, poiId: number, newTags: Tag[] = []) {
  yield all(newTags.map((tag) => call(createAndLinkTag, mallId, poiId, tag)));
}

function* createAndLinkTag(mallId: number, poiId: number, newTag: Tag) {
  try {
    const response: Tag = yield call(api.tag.findOrCreateTag, mallId, newTag);
    yield call(linkTag, mallId, poiId, response.id);
  } catch (error) {
    return put(tagActions.createEntityFailure(error));
  }
}

function* unlinkCategories(
  mallId: number,
  poiId: number,
  categoryIds: number[] = []
) {
  yield all(categoryIds.map((id) => call(unlinkCategory, mallId, poiId, id)));
}

function* unlinkCategory(mallId: number, poiId: number, categoryId: number) {
  try {
    yield call(api.poi.unlinkCategory, mallId, poiId, categoryId);
  } catch (error) {
    yield put(actions.resourceUnlinkFailed(poiId, 'categories', categoryId));
  }
}

function* unlinkPwpois(
  mallId: number,
  poiId: number,
  pwpoisIds: Array<number | string> = []
) {
  yield all(
    pwpoisIds.map((id: number | string) => call(unlinkPwpoi, mallId, poiId, id))
  );
}

function* unlinkPwpoi(mallId: number, poiId: number, pwpoiId: number | string) {
  try {
    yield call(api.poi.unlinkPwPoi, mallId, poiId, pwpoiId);
  } catch (error) {
    yield put(actions.resourceUnlinkFailed(poiId, 'pwpoi', pwpoiId as number));
  }
}

function* linkChannels(mallId: number, poiId: number, ids: number[] = []) {
  yield all(ids.map((id) => call(linkChannel, mallId, poiId, id)));
}

function* linkChannel(mallId: number, poiId: number, id: number) {
  try {
    yield call(api.poi.linkChannel, mallId, poiId, id);
    yield put(actions.resourceLinkSuccess(poiId, 'channels', id));
  } catch (error) {
    yield put(actions.resourceLinkFailed(poiId, 'channels', id, error));
  }
}

function* unlinkChannels(mallId: number, poiId: number, ids: number[] = []) {
  yield all(ids.map((id) => call(unlinkChannel, mallId, poiId, id)));
}

function* unlinkChannel(mallId: number, poiId: number, id: number) {
  try {
    yield call(api.poi.unlinkChannel, mallId, poiId, id);
    yield put(actions.resourceUnlinkSuccess(poiId, 'channels', id));
  } catch (error) {
    yield put(actions.resourceUnlinkFailed(poiId, 'channels', id));
  }
}

export function* fetchAllSucCodesFromMaaS(action: FetchAllSucCodesAction) {
  try {
    const { mallId } = action.payload;
    const mall: Mall = yield select(getMallById, mallId);
    const { buildingId } = mall;
    const limit = 200;
    let offset = 0;
    let result: PwPageData<PwPoiDTO> = yield call(
      api.maas.fetchPois,
      buildingId,
      limit,
      offset
    );
    yield put(
      actions.addSucCodes(mallId, getSucCodeListFromPwPoiList(result.data))
    );
    if (result.pagination.results.total > limit) {
      for (let page = 2; page <= result.pagination.pages.total; page++) {
        offset = (page - 1) * limit;
        result = yield call(api.maas.fetchPois, buildingId, limit, offset);
        yield put(
          actions.addSucCodes(mallId, getSucCodeListFromPwPoiList(result.data))
        );
      }
    }
  } catch (error) {
    actions.addSucFailure(error);
  }
}

export function* fetchPoi(action: FetchPoiAction) {
  try {
    const { mallId, id, language } = action.payload;
    const customHeaders: CustomHeaders = {
      'accept-language': language,
    };
    const response: Poi = yield call(
      api.poi.fetchById,
      mallId,
      id,
      customHeaders
    );

    const { entities, result: poiIds } = normalize([response], poiListSchema);

    yield put(
      actions.fetchPoiSuccess(
        poiIds,
        entities,
        undefined,
        undefined,
        undefined,
        language
      )
    );
  } catch (e) {
    yield put(actions.fetchPoiFailure(e));
  }
}

export const poiSagas = [
  takeEvery(types.FETCH_POI_REQUEST, fetchPoi),
  takeEvery(types.FETCH_POI_LIST_REQUEST, fetchPois),
  takeEvery(types.FETCH_ALL_SUC_CODES, fetchAllSucCodesFromMaaS),
  takeEvery(types.CREATE_POI_REQUEST, createMallPoi),
  takeEvery(types.UPDATE_POI_REQUEST, updateMallPoi),
];
