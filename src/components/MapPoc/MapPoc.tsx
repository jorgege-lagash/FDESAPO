import React from 'react';

import L, { LatLngBoundsExpression } from 'leaflet';
import isEmpty from 'lodash/isEmpty';
import {
  ImageOverlay,
  Map as LeafletMap,
  MapProps,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { domToImageDownload } from 'src/utils/image.utils';
import { fixmarkers } from 'src/utils/makerhack';
declare var document: Document;

const testFloor = {
  id: 320926,
  name: 'B2',
  originalMapUrl: null,
  level: -2,
  isOutdoor: false,
  width: 0,
  height: 0,
  offsetX: 0,
  offsetY: 0,
  locationMapHierarchy: null,
  createdAt: '2019-03-08T23:33:49Z',
  updatedAt: '2019-03-08T23:33:49Z',
  buildingId: 65635,
  resources: [
    {
      id: 218718,
      floorId: 320926,
      pdfUrl:
        'https://lbs-prod.s3.amazonaws.com/venues/ba17009c-8a11-43aa-ba3d-17ca6ddf0539/maps/320926/CedarsSinai_Campus_B2_1220_complete.pdf',
      svgUrl:
        'https://lbs-prod.s3.amazonaws.com/venues/ba17009c-8a11-43aa-ba3d-17ca6ddf0539/maps/320926/cedarssinai_campus_b2.svg',
      zoomLevel: 0,
      createdAt: '2019-03-08T23:34:15Z',
      updatedAt: '2019-03-08T23:34:15Z',
      externalId: 218718,
    },
  ],
  venueGuid: '95380e20-b1bc-47f1-9678-ee0984f1dbf1',
  maxZoomLevel: 0,
  referencePoints: {
    rotation: 0,
    topLeft: {
      latitude: 34.077874,
      longitude: -118.384412,
    },
    topRight: {
      latitude: 34.077874,
      longitude: -118.376301,
    },
    bottomLeft: {
      latitude: 34.073075,
      longitude: -118.384412,
    },
    bottomRight: {
      latitude: 34.073075,
      longitude: -118.376301,
    },
    portal: {
      topRight: {
        latitude: 34.077874,
        longitude: -118.376301,
      },
      bottomLeft: {
        latitude: 34.073075,
        longitude: -118.384412,
      },
    },
  },
  externalId: 320926,
  scalePct: 100,
};

const processFloor = (floor: any) => {
  let buildingSvg = '';
  let floorPosition: any[] = [];

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

const demoFloor = processFloor(testFloor);

interface Location {
  latitude: number;
  longitude: number;
}

export class SimpleExample extends React.Component {
  public mapRef = React.createRef<LeafletMap<MapProps>>();
  public state = {
    lat: 34.075153,
    lng: -118.380277,
    zoom: 15,
  };
  constructor(props: any) {
    super(props);
    fixmarkers();
  }
  public componentDidMount() {
    const position = { latitude: this.state.lat, longitude: this.state.lng };
    this.fitBounds([position]);
  }

  public fitBounds = (pois: Location[] = [], lines: Location[] = []) => {
    // Don't fitBounds on smaller viewports because it can seldomly fit all the points and zooms out.
    // Added lines to bounds since somtimes lines are outside the POI spaces
    const currentMap = this.mapRef.current!;
    const bounds: LatLngBoundsExpression = [
      ...pois.map((poi): [number, number] => [poi.latitude, poi.longitude]),
      // ...lines,
    ];

    let padding: [number, number] = [0, 0];
    if (isEmpty(bounds)) {
      return;
    }
    if (document.documentElement.clientWidth > 418) {
      padding = [50, 50];
      const mapBound = L.latLngBounds(bounds).pad(0.02);
      this.mapRef.current!.leafletElement.fitBounds(mapBound, {
        padding,
      });
    } else {
      currentMap.leafletElement.fitBounds(bounds, { padding });
      const center = L.polyline(bounds)
        .getBounds()
        .getCenter();
      currentMap.leafletElement.panTo(center);
    }
  };
  public download = () => {
    const filename = 'map-image';
    const currentMap = this.mapRef.current;
    if (currentMap) {
      domToImageDownload(currentMap.leafletElement.getContainer(), filename);
    }
  };
  public render() {
    const position: [number, number] = [this.state.lat, this.state.lng];
    return (
      <>
        <button onClick={this.download}> descargar</button>
        <LeafletMap<MapProps>
          ref={this.mapRef}
          center={position}
          zoom={this.state.zoom}
          preferCanvas={true}
          minZoom={8}
          maxZoom={18}
          style={{
            height: '400px',
            minWidth: '80vw',
          }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RldmVvZG9tIiwiYSI6ImNpdGJ1a2ppYjA4aWkydXM2OGlodXc3MXIifQ.5MPIoqZ8r52YfyqhyB-07g"
          />
          <ImageOverlay
            url={demoFloor.buildingSvg}
            bounds={demoFloor.floorPosition}
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LeafletMap>
      </>
    );
  }
}
