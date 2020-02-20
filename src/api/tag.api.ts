import { Tag } from 'src/types/response/Tag';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';

const api = createBasicCrudRequests<Tag>('tags');

const findOrCreateTag = (mallId: number, data: Tag): Promise<Tag> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post<Tag>('tags/find-or-create', data, {}, mallHeader);
};

import { addMallHeader, HttpService } from 'src/utils/request';

export const tag = {
  ...api,
  findOrCreateTag,
};
