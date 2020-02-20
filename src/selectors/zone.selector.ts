import { get } from 'lodash';
import { ApplicationState } from 'src/reducers';
import { Zone } from 'src/types/response/Zone';

export const getMallZoneArray = (state: ApplicationState): Zone[] => {
  const zoneMap: { [id: string]: Zone } = state.entities.zones;
  const zoneIds: number[] = state.zones.list;
  return zoneIds.map((id) => zoneMap[id]).filter((zone) => zone);
};

export const getGlobalZoneIds = (state: ApplicationState) => {
  const zones = state.entities.zones || {};
  return Object.keys(zones);
};

export const getZonesByMallId = (
  state: ApplicationState,
  mallId: number
): Zone[] => {
  const zones = state.entities.zones || {};
  const ids = getGlobalZoneIds(state);
  return ids
    .map((id): Zone => zones[id])
    .filter((zone) => zone.mallId === mallId);
};

export const getZoneIdsByMallId = (
  state: ApplicationState,
  mallId: number
): number[] => {
  return getZonesByMallId(state, mallId).map((zone) => zone.id);
};

export const getZoneById = (state: ApplicationState, zoneId: string) => {
  return get(state, `entities.zones[${zoneId}]`, null);
};
