import { get } from 'lodash';
import { createSelector } from 'reselect';
import { ApplicationState } from 'src/reducers';
import { PwPoi } from 'src/types/response/PwPoi';

export const filterPwPoisBySuc = (poi: PwPoi[], suc: string) => {
  if (!suc) {
    return [];
  }
  const sucLowerCase = suc.trim().toLowerCase();
  return poi.filter((p) => p.suc && p.suc.toLowerCase() === sucLowerCase);
};

export const filterPwPoisByPoiType = createSelector(
  [(poi: PwPoi[]) => poi, (_: any, poiType: number) => poiType],
  (poi: PwPoi[], poiType: number) => {
    return poi.filter((p) => p.poiTypeId === poiType);
  }
);

export const filterPwPoisByBuildingId = (poi: PwPoi[], buildingId: number) =>
  poi.filter((p) => p.buildingId === buildingId);

export const selectGlobalPwPoiList = (state: ApplicationState): PwPoi[] => {
  const pwpoisMap = get(state, 'entities.pwpois', {});
  return Object.keys(pwpoisMap).map((id) => pwpoisMap[id] as PwPoi);
};

export const selectPwPoisBySuc = (
  state: ApplicationState,
  suc: string
): PwPoi[] => {
  const poiList = selectGlobalPwPoiList(state);
  return filterPwPoisBySuc(poiList, suc);
};

export const selectPwPoisByBuildingId = (
  state: ApplicationState,
  buildingId: number
): PwPoi[] => {
  const poiList = selectGlobalPwPoiList(state);
  return filterPwPoisByBuildingId(poiList, buildingId);
};

export const selectPwPoisBySucAndBuildingId = (
  state: ApplicationState,
  suc: string,
  buildingId: number
): PwPoi[] => {
  const poiList = selectGlobalPwPoiList(state);
  return filterPwPoisBySuc(filterPwPoisByBuildingId(poiList, buildingId), suc);
};
