import L, {
  LatLng,
  LatLngBoundsExpression,
  LatLngExpression,
  LatLngTuple,
  Map,
} from 'leaflet';
import { isEmpty, sortBy } from 'lodash';
import { Map as LeafletMap, MapProps } from 'react-leaflet';
import { PwFloor, PwFloorDTO, PwLocation } from 'src/types/response/PwBuilding';
import { PwPoi } from 'src/types/response/PwPoi';
declare var document: Document;

export const poiToCompleteName = (poi: PwPoi): string => {
  return `L${poi.level}-${poi.name}`;
};

export const processFloor = (floor: PwFloorDTO): PwFloor => {
  let buildingSvg = '';
  let floorPosition: LatLngBoundsExpression = [];

  if (floor && floor.resources.length && floor.resources[0].svgUrl) {
    buildingSvg = floor.resources[0].svgUrl;
  }

  if (floor && floor.referencePoints) {
    const p = floor.referencePoints;
    floorPosition = [
      [p.topLeft.latitude, p.topLeft.longitude],
      [p.topRight.latitude, p.topRight.longitude],
      [p.bottomRight.latitude, p.bottomRight.longitude],
      [p.bottomLeft.latitude, p.bottomLeft.longitude],
    ];
  }

  return Object.assign({}, floor, {
    buildingSvg,
    floorPosition,
  });
};

export const sortFloors = (floors: PwFloorDTO) => {
  return sortBy(floors, 'level');
};

export const fitMapBounds = (
  currentMap: LeafletMap<MapProps, Map>,
  pois: LatLngTuple[] = [],
  lines: LatLngTuple[] = []
) => {
  // Don't fitBounds on smaller viewports because it can seldomly fit all the points and zooms out.
  // Added lines to bounds since somtimes lines are outside the POI spaces
  const bounds: LatLngBoundsExpression = [...pois, ...lines];

  let padding: [number, number] = [0, 0];
  if (isEmpty(bounds)) {
    return;
  }
  if (document.documentElement.clientWidth > 418) {
    padding = [50, 50];
    const mapBound = L.latLngBounds(bounds).pad(0.02);
    currentMap.leafletElement.fitBounds(mapBound, {
      padding,
    });
  } else {
    currentMap.leafletElement.fitBounds(bounds, { padding });
    const center = getLatLngCenter(bounds);
    currentMap.leafletElement.panTo(center);
  }
};

export const getLatLngCenter = (
  bounds: LatLngExpression[] | LatLngExpression[][]
): LatLng => {
  return L.polyline(bounds)
    .getBounds()
    .getCenter();
};

export const getLatLngTupleCenter = (
  bounds: LatLngExpression[] | LatLngExpression[][]
): LatLngTuple => {
  const center = getLatLngCenter(bounds);
  return [center.lat, center.lng];
};

export const convertPwLocationToLatLngTuple = (
  location: PwLocation
): LatLngTuple => {
  return [location.latitude, location.longitude];
};

export const getCentroid = (arr: LatLngTuple[]): LatLngTuple => {
  let twoTimesSignedArea = 0;
  let cxTimes6SignedArea = 0;
  let cyTimes6SignedArea = 0;

  const length = arr.length;

  const x = (i: number) => arr[i % length][0];
  const y = (i: number) => arr[i % length][1];

  for (let i = 0; i < arr.length; i++) {
    const twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
    twoTimesSignedArea += twoSA;
    cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
    cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
  }
  const sixSignedArea = 3 * twoTimesSignedArea;
  return [
    cxTimes6SignedArea / sixSignedArea,
    cyTimes6SignedArea / sixSignedArea,
  ];
};
