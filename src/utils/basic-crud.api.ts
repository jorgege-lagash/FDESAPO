import { LooseObject } from 'src/types/LooseObject';
import { PageData } from 'src/types/response/PaginatedData';
import { createPaginationObject } from 'src/utils/index';
import {
  addMallHeader,
  CustomHeaders,
  CustomRequestOptions,
  HttpService,
} from 'src/utils/request';

export interface BasicCrudRequests<T> {
  fetchById: (
    mallId: number,
    id: number,
    query?: LooseObject,
    customHeaders?: CustomHeaders
  ) => Promise<T>;
  fetchAll: (mallId: number, query?: LooseObject) => Promise<T[]>;
  fetchPage: (
    mallId: number,
    page?: number,
    limit?: number,
    skip?: number,
    query?: LooseObject,
    customHeaders?: CustomHeaders
  ) => Promise<PageData<T>>;
  create: (mallId: number, data: T) => Promise<T>;
  delete: (mallId: number, id: number) => Promise<{}>;
  update: (
    mallId: number,
    id: number,
    data: T,
    customHeaders?: CustomHeaders
  ) => Promise<T>;
  linkUploadedFile: (mallId: number, id: number, fileId: number) => Promise<{}>;
}

export const createBasicCrudRequests = <T>(
  resourceName: string
): BasicCrudRequests<T> => {
  const getMallEntityById = (
    mallId: number,
    id: number,
    query?: LooseObject,
    customHeaders: CustomHeaders = {}
  ): Promise<T> => {
    const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
    const options: CustomRequestOptions = {
      query: {
        ...query,
      },
    };
    return HttpService.get<T>(`${resourceName}/${id}`, options, mallHeader);
  };

  const deleteMallEntityById = (mallId: number, id: number): Promise<{}> => {
    const options: CustomRequestOptions = {};
    const mallHeader = addMallHeader(mallId);
    return HttpService.delete(`${resourceName}/${id}`, {}, options, mallHeader);
  };

  const getMallEntityList = (
    mallId: number,
    query?: LooseObject
  ): Promise<T[]> => {
    const options: CustomRequestOptions = { ...(query && { query }) };
    const mallHeader = addMallHeader(mallId);
    return HttpService.get<T[]>(`${resourceName}`, options, mallHeader);
  };

  const getMallPagedEntityList = (
    mallId: number,
    page?: number,
    limit?: number,
    skip?: number,
    query?: LooseObject,
    customHeaders: CustomHeaders = {}
  ): Promise<PageData<T>> => {
    const pageFilter = createPaginationObject(page, limit, skip);
    const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
    const options: CustomRequestOptions = {
      query: {
        ...pageFilter,
        ...query,
      },
    };
    return HttpService.get<PageData<T>>(`${resourceName}`, options, mallHeader);
  };

  const createMallEntity = (mallId: number, data: T): Promise<T> => {
    const mallHeader = addMallHeader(mallId);
    return HttpService.post<T>(`${resourceName}`, data, {}, mallHeader);
  };

  const updateMallEntity = (
    mallId: number,
    id: number,
    data: T,
    customHeaders: CustomHeaders = {}
  ): Promise<T> => {
    const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
    return HttpService.patch<T>(`${resourceName}/${id}`, data, {}, mallHeader);
  };

  const linkUploadedFile = (
    mallId: number,
    id: number,
    fileId: number,
    data: any = {},
    customHeaders: CustomHeaders = {}
  ) => {
    const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
    return HttpService.post(
      `${resourceName}/${id}/files/${fileId}/link`,
      data,
      {},
      mallHeader
    );
  };

  return {
    fetchById: getMallEntityById,
    fetchAll: getMallEntityList,
    fetchPage: getMallPagedEntityList,
    create: createMallEntity,
    update: updateMallEntity,
    delete: deleteMallEntityById,
    linkUploadedFile,
  };
};
