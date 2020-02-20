import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { LooseObject } from '../types/LooseObject';
import authentication, { SessionState } from './auth.reducer';
import categories, { CategoryState } from './category.reducer';
import deals, { DealState } from './deal.reducer';
import entitiesReducer from './entities.reducer';
import events, { EventDirectoryState } from './event-directory.reducer';
import featuredSpaces, { FeaturedSpaceState } from './featured-space.reducer';
import locale, { LocaleState } from './locale.reducer';
import malls, { MallState } from './mall.reducer';
import permissions, { PermissionState } from './permission.reducer';
import poiState, { PoiStateState } from './poi-state.reducer';
import pois, { PoiState } from './poi.reducer';
import pwpois, { PwPoiState } from './pwpoi.reducer';
import tags, { TagState } from './tag.reducer';
import terms, { TermsOfServiceState } from './terms.reducer';
import timeZones, { TimeZoneState } from './time-zone.reducer';
import zones, { ZoneState } from './zone.reducer';
import poiMallZones, { PoiMallZoneState } from './poi-mall-zone.reducer';

export interface ApplicationState {
  router: RouterState;
  session: SessionState;
  locale: LocaleState;
  entities: LooseObject;
  permissions: PermissionState;
  malls: MallState;
  zones: ZoneState;
  terms: TermsOfServiceState;
  pois: PoiState;
  pwpois: PwPoiState;
  categories: CategoryState;
  featuredSpaces: FeaturedSpaceState;
  tags: TagState;
  deals: DealState;
  events: EventDirectoryState;
  poiState: PoiStateState;
  timeZones: TimeZoneState;
  poiMallZones: PoiMallZoneState;
}

export default (history: History) =>
  combineReducers<ApplicationState>({
    router: connectRouter(history),
    session: authentication,
    locale,
    entities: entitiesReducer,
    events,
    permissions,
    malls,
    zones,
    terms,
    pois,
    pwpois,
    categories,
    featuredSpaces,
    tags,
    deals,
    poiState,
    timeZones,
    poiMallZones,
  });
