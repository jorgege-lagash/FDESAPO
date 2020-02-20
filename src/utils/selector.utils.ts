import { get } from 'lodash';
import { denormalize, Schema } from 'normalizr';
import { createSelector } from 'reselect';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';

interface Entity {
  id: number;
}

interface MallEntity extends Entity {
  mallId: number;
}
export const getEntityDictionary = (
  state: ApplicationState,
  entityName: string
) => get(state, `entities.${entityName}`, {});

export const getEntityArray = <T extends Entity>(entityName: string) => (
  state: ApplicationState
): T[] => {
  const entityMap: { [id: string]: T } = getEntityDictionary(state, entityName);
  const ids: number[] = get(state, `${entityName}.list`, []);
  return ids.map((id) => entityMap[id]).filter((entity) => entity);
};

export const getGlobalEntityIds = (entityName: string) => (
  state: ApplicationState
) => {
  const entities = get(state, `entities.${entityName}`, {});
  return Object.keys(entities);
};

export const getGlobalEntityArray = <T>(entityName: string) =>
  createSelector(
    [
      (state: ApplicationState) => getEntityDictionary(state, entityName),
      (state: ApplicationState) => getGlobalEntityIds(entityName)(state),
    ],
    (entities: TypedLooseObject<T>, ids: string[]): T[] => {
      return ids.map((id) => entities[id]).filter((entity) => entity);
    }
  );
// (state: ApplicationState): T[] => {
//   const entities = get(state, `entities.${entityName}`, {});
//   const ids = getGlobalEntityIds(entityName)(state);
//   return ids.map((id) => entities[id] as T).filter((entity) => entity);
// }

export const getEntitiesByMallId = <T extends MallEntity>(entityName: string) =>
  createSelector(
    [
      (state: ApplicationState) => get(state, `entities.${entityName}`, {}),
      getGlobalEntityIds(entityName),
      (_: any, mallId: number) => mallId,
    ],

    (entities: TypedLooseObject<T>, ids: string[], mallId: number): T[] => {
      return ids
        .map((id: string): T => entities[id])
        .filter((entity) => entity && entity.mallId === mallId);
    }
  );

export const getEntityIdsByMallId = <T extends MallEntity>(
  entityName: string
) =>
  createSelector(
    [getEntitiesByMallId<T>(entityName)],
    (entityList) =>
      entityList.map((entity) => entity.id).filter((entity) => entity)
  ) as (state: ApplicationState, mallId: number) => number[];

export const getEntityById = <T>(entityName: string) => (
  state: ApplicationState,
  id: string | number
): T | null => get(state, `entities.${entityName}[${id}]`, null);

export const getTranslatedEntityById = <T>(entityName: string) => (
  state: ApplicationState,
  id: string | number,
  language: string
): T | null => get(state, `entities.${language}.${entityName}[${id}]`, null);

export const getDenormalizedEntities = <T>(
  entityName: string,
  entitySchema: Schema
) => (state: ApplicationState, ids: number[] | string[]): T[] => {
  const entities = state.entities || {};
  if (!entities[entityName]) {
    return [];
  }
  return denormalize(ids, entitySchema, state.entities || {});
};

export const getEntityArrayById = <T extends Entity>(entityName: string) => (
  state: ApplicationState,
  ids: number[] | string[]
): T[] => {
  const entity: TypedLooseObject<T> = get(
    state,
    `entities.${entityName}`,
    null
  );
  if (!entity) {
    return [];
  }
  return (ids as string[]).map((id) => entity[id]).filter((e) => e);
};
