import { LooseObject } from 'src/types/LooseObject';
import { Deal } from 'src/types/response/Deal';
import { PageData } from 'src/types/response/PaginatedData';
import { Poi } from 'src/types/response/POI';
import { createPaginationObject } from 'src/utils';
import {
  addMallHeader,
  CustomHeaders,
  CustomRequestOptions,
  HttpService,
} from 'src/utils/request';

const includes = [
  'travelerDiscount',
  'channels',
  'screenshot',
  'deals',
  'poiType',
  'poiMallZone',
];
export const fetchAllPOIs = (
  mallId: number,
  page?: number,
  limit?: number,
  skip?: number,
  query?: LooseObject,
  customHeaders: CustomHeaders = {}
) => {
  const pageFilter = createPaginationObject(page, limit, skip);
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  const options: CustomRequestOptions = {
    query: {
      include: JSON.stringify(includes),
      ...pageFilter,
      ...query,
    },
  };
  return HttpService.get<PageData<Poi>>('pois', options, mallHeader);
};

const createMallPois = (
  mallId: number,
  data: Poi,
  customHeaders: CustomHeaders = {}
): Promise<Poi> => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  const options: CustomRequestOptions = {
    query: {
      include: JSON.stringify(includes),
    },
  };
  return HttpService.post<Poi>('pois', data, options, mallHeader);
};

const updateMallPoi = (
  mallId: number,
  poiId: number,
  data: Poi,
  customHeaders: CustomHeaders = {}
): Promise<Poi> => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  const options: CustomRequestOptions = {
    query: {
      include: JSON.stringify(includes),
    },
  };
  return HttpService.patch<Poi>(`pois/${poiId}`, data, options, mallHeader);
};

const fetchMallPoi = (
  mallId: number,
  id: number,
  customHeaders: CustomHeaders = {}
): Promise<Poi> => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  const options: CustomRequestOptions = {
    query: {
      include: JSON.stringify(includes),
    },
  };
  return HttpService.get<Poi>(`pois/${id}`, options, mallHeader);
};

const linkCategory = (mallId: number, poiId: number, categoryId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(
    `pois/${poiId}/categories/${categoryId}/link`,
    {},
    {},
    mallHeader
  );
};

const linkTag = (mallId: number, poiId: number, tagId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(
    `pois/${poiId}/tags/${tagId}/link`,
    {},
    {},
    mallHeader
  );
};

const unlinkTag = (mallId: number, poiId: number, tagId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.delete(
    `pois/${poiId}/tags/${tagId}/link`,
    {},
    {},
    mallHeader
  );
};

const unlinkCategory = (mallId: number, poiId: number, categoryId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.delete(
    `pois/${poiId}/categories/${categoryId}/link`,
    {},
    {},
    mallHeader
  );
};

const linkPwPoi = (mallId: number, poiId: number, pwpoiId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(
    `pois/${poiId}/phunware/${pwpoiId}`,
    {},
    {},
    mallHeader
  );
};

const unlinkPwPoi = (mallId: number, poiId: number, pwpoiId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.delete(
    `pois/${poiId}/phunware/${pwpoiId}`,
    {},
    {},
    mallHeader
  );
};

// link uploaded file pois/:id/files/:id/link
const linkUploadedFile = (mallId: number, poiId: number, fileId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(
    `pois/${poiId}/files/${fileId}/link`,
    {},
    {},
    mallHeader
  );
};

const linkScreenshot = (mallId: number, poiId: number, fileId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(
    `pois/${poiId}/screenshots/${fileId}/link`,
    {},
    {},
    mallHeader
  );
};

const linkChannel = (mallId: number, poiId: number, channelId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(
    `pois/${poiId}/channels/${channelId}/link`,
    {},
    {},
    mallHeader
  );
};

const unlinkChannel = (mallId: number, poiId: number, channelId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.delete(
    `pois/${poiId}/channels/${channelId}/link`,
    {},
    {},
    mallHeader
  );
};

const createDeal = (mallId: number, poiId: number, deal: Deal) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post(`pois/${poiId}/deals`, deal, {}, mallHeader);
};
const removeDeal = (mallId: number, poiId: number, dealId: number) => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.delete(
    `pois/${poiId}/deals/${dealId}`,
    {},
    {},
    mallHeader
  );
};

const findPoiByAssociatedPwPoiId = (
  mallId: number,
  pwpoiId: number,
  customHeaders: CustomHeaders = {}
): Promise<Poi> => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  const options: CustomRequestOptions = {};
  return HttpService.get<Poi>(`pois/phunware/${pwpoiId}`, options, mallHeader);
};

const validateIsPwPoiAssociated = async (mallId: number, pwpoiId: number) => {
  try {
    return await findPoiByAssociatedPwPoiId(mallId, pwpoiId);
  } catch (error) {
    return Promise.resolve(null);
  }
};
export const poi = {
  fetchById: fetchMallPoi,
  fetchAll: fetchAllPOIs,
  create: createMallPois,
  update: updateMallPoi,
  linkCategory,
  unlinkCategory,
  linkPwPoi,
  unlinkPwPoi,
  linkUploadedFile,
  linkChannel,
  unlinkChannel,
  linkScreenshot,
  linkTag,
  unlinkTag,
  findPoiByAssociatedPwPoiId,
  validateIsPwPoiAssociated,
  createDeal,
  removeDeal,
};
