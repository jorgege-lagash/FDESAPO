import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';
import { addMallHeader, CustomHeaders, HttpService } from 'src/utils/request';

const api = createBasicCrudRequests<FeaturedSpace>('featureSpace');

const linkImage = (
  mallId: number,
  featuredSpaceId: number,
  fileId: number,
  data: any = {},
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };

  return HttpService.post(
    `featureSpace/${featuredSpaceId}/files/${fileId}/link`,
    data,
    {},
    mallHeader
  );
};

const unlinkImage = (
  mallId: number,
  featuredSpaceId: number,
  fileId: number,
  data: any = {},
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  return HttpService.delete(
    `featureSpace/${featuredSpaceId}/files/${fileId}/link`,
    data,
    {},
    mallHeader
  );
};
export const featuredSpace = {
  ...api,
  linkImage,
  unlinkImage,
};
