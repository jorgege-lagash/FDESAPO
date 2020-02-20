import { all, takeLatest } from 'redux-saga/effects';
import { types as permissionActionTypes } from '../actions/permission.action';
import { authSagas } from './auth.sagas';
import { categorySagas } from './category.saga';
import { channelSagas } from './channel.saga';
import { dealSagas } from './deal.saga';
import { eventDirectorySagas } from './event.saga';
import { featureSpaceTypeSagas } from './feature-space-type.saga';
import { featuredSpaceSagas } from './featured-space.saga';
import { maasSagas } from './maas.sagas';
import { mallSagas } from './mall.saga';
import { fetchMallPermissions } from './permission.saga';
import { poiStateSagas } from './poi-state.saga';
import { poiTypeSagas } from './poi-type.saga';
import { poiSagas } from './poi.saga';
import { scheduleSagas } from './schedule.saga';
import { tagSagas } from './tag.saga';
import { termSagas } from './terms.saga';
import { timeZoneSagas } from './time-zone.saga';
import { travelerDiscountSagas } from './traveler-discount.saga';
import { zoneSagas } from './zone.saga';

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...mallSagas,
    ...scheduleSagas,
    ...zoneSagas,
    ...termSagas,
    ...poiSagas,
    ...poiTypeSagas,
    ...maasSagas,
    ...categorySagas,
    ...eventDirectorySagas,
    ...channelSagas,
    ...featuredSpaceSagas,
    ...travelerDiscountSagas,
    ...tagSagas,
    ...featureSpaceTypeSagas,
    ...dealSagas,
    ...poiStateSagas,
    ...timeZoneSagas,
    takeLatest(
      permissionActionTypes.FETCH_MALL_PERMISSIONS_REQUEST,
      fetchMallPermissions
    ),
  ]);
}
