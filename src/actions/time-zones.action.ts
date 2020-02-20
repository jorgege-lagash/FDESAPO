const entityName = 'TIME-ZONES';

export const types = {
  FETCH_LIST_FAILURE: `${entityName}/FETCH_LIST_FAILURE`,
  FETCH_LIST_REQUEST: `${entityName}/FETCH_LIST_REQUEST`,
  FETCH_LIST_SUCCESS: `${entityName}/FETCH_LIST_SUCCESS`,
};

const fetchTimeZonesList = (mallId: number) => {
  return {
    type: types.FETCH_LIST_REQUEST,
    payload: { mallId },
  };
};

const fetchTimeZonesListSuccess = (list: string[], total: number) => {
  return {
    type: types.FETCH_LIST_SUCCESS,
    payload: {
      list,
      total,
    },
  };
};
const fetchTimeZonesListFailure = (error: any) => {
  return {
    type: types.FETCH_LIST_FAILURE,
    payload: {
      error,
    },
  };
};

export const actions = {
  fetchTimeZonesList,
  fetchTimeZonesListSuccess,
  fetchTimeZonesListFailure,
};
