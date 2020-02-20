import { MallPermission } from '../types/response/MallPermission';
import { CustomRequestOptions, HttpService } from '../utils/request';

export const getUserPermissionsInMall = (userId: number, mallId: number) => {
  const options: CustomRequestOptions = {
    query: {
      mallId,
    },
  };
  return HttpService.get<MallPermission[]>(
    `users/${userId}/permissions`,
    options,
    {}
  );
};
