import { LooseObject } from 'src/types/LooseObject';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';
import {
  addMallHeader,
  CustomHeaders,
  CustomRequestOptions,
  HttpService,
} from 'src/utils/request';

const api = createBasicCrudRequests<EventDirectory>('eventDirectory');

const includes = ['picture'];

const linkImage = (
  mallId: number,
  eventDirectoryId: number,
  fileId: number,
  data: any = {},
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };

  return HttpService.post(
    `eventDirectory/${eventDirectoryId}/files/${fileId}/link`,
    data,
    {},
    mallHeader
  );
};

const unlinkImage = (
  mallId: number,
  eventDirectoryId: number,
  fileId: number,
  data: any = {},
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  return HttpService.delete(
    `featureSpace/${eventDirectoryId}/files/${fileId}/link`,
    data,
    {},
    mallHeader
  );
};

const fetchMallEventDirectory = (
  mallId: number,
  id: number,
  query?: LooseObject,
  customHeaders: CustomHeaders = {}
): Promise<EventDirectory> => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  const options: CustomRequestOptions = {
    query: {
      include: JSON.stringify(includes),
    },
  };
  return HttpService.get<EventDirectory>(
    `eventDirectory/${id}`,
    options,
    mallHeader
  );
};

delete api.fetchById;

export const eventDirectory = {
  ...api,
  fetchById: fetchMallEventDirectory,
  linkImage,
  unlinkImage,
};
