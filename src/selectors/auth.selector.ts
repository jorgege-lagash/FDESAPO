import { get, set } from 'lodash';
import { createSelector } from 'reselect';
import { ApplicationState } from '../reducers';
import { TypedLooseObject } from '../types/LooseObject';
import { MallPermission } from '../types/response/MallPermission';

export const getPermissionArray = (
  state: ApplicationState
): MallPermission[] => {
  const permissionObject: TypedLooseObject<MallPermission> =
    state.entities.permissions || {};

  return Object.keys(permissionObject).reduce<MallPermission[]>((acc, key) => {
    return [...acc, permissionObject[key]];
  }, []);
};

export const getApplicationPermissions = createSelector(
  [getPermissionArray],
  (permissions): any => {
    return permissions.reduce((acc, curr) => {
      return set(acc, curr.name, true);
    }, {});
  }
);

export const hasRequiredPermissions = (
  requiredPermissions: string[],
  permissions: any
): boolean => {
  return requiredPermissions.reduce((prev, curr) => {
    return prev && get(permissions, curr, false);
  }, true);
};
