import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';
import { addMallHeader, CustomHeaders, HttpService } from 'src/utils/request';
const resourceName = 'travelerDiscount';
const api = createBasicCrudRequests<TravelerDiscount>(resourceName);

const linkImage = (
  mallId: number,
  resourceId: number,
  fileId: number,
  data: any = {},
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };

  return HttpService.post(
    `${resourceName}/${resourceId}/files/${fileId}/link`,
    data,
    {},
    mallHeader
  );
};

const unlinkImage = (
  mallId: number,
  resourceId: number,
  fileId: number,
  data: any = {},
  customHeaders: CustomHeaders = {}
) => {
  const mallHeader = { ...addMallHeader(mallId), ...customHeaders };
  return HttpService.delete(
    `${resourceName}/${resourceId}/files/${fileId}/link`,
    data,
    {},
    mallHeader
  );
};
export const travelerDiscount = {
  ...api,
  linkImage,
  unlinkImage,
};
