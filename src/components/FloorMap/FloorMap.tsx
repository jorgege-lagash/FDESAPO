import React from 'react';

import { LatLngTuple } from 'leaflet';
import {
  Map as LeafletMap,
  MapProps,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { LooseObject } from 'src/types/LooseObject';
import { PwFloor, PwLocation } from 'src/types/response/PwBuilding';
import { PwPoi } from 'src/types/response/PwPoi';

import ResizeObserver from 'resize-observer-polyfill';
import { fixmarkers } from 'src/utils/makerhack';
import {
  convertPwLocationToLatLngTuple,
  fitMapBounds,
  getLatLngTupleCenter,
} from 'src/utils/map.utils';
import MapPoi from './MapPoi';
import RotImageOverlay from './RotImageOvelay';

interface Viewport {
  center: [number, number];
  zoom: number;
}

interface Props {
  floor: PwFloor | null;
  pois: PwPoi[];
  markers: PwLocation[];
  style?: React.CSSProperties;
  allowInteraction: boolean;
}

interface OwnState {
  zoomLevel: number;
}

const defaultProps = {
  allowInteraction: true,
  floor: {
    buildingSvg: '',
    floorPosition: [[0, 0]],
  },
  pois: [],
  markers: [],
};

export class FloorMap extends React.Component<Props, OwnState> {
  public static readonly defaultProps = defaultProps;

  public mapRef = React.createRef<LeafletMap<MapProps>>();

  public state = {
    zoomLevel: 18,
  };

  constructor(props: any) {
    super(props);
    fixmarkers();
  }

  public componentDidMount() {
    const { floor } = this.props;
    if (floor) {
      fitMapBounds(this.mapRef.current!, floor.floorPosition);
    }

    const mapContainer = document.getElementById('mapContainer')!;
    const mapResizeObserver = new ResizeObserver((entries, observer) => {
      if (this.currentMap) {
        this.currentMap.leafletElement.invalidateSize();
      }
    });
    mapResizeObserver.observe(mapContainer);
    this.updateInteraction();
  }

  public updateInteraction(allowInteraction = this.props.allowInteraction) {
    if (!this.currentMap) {
      return;
    }
    const map = this.currentMap.leafletElement;
    if (allowInteraction) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.keyboard.enable();
      if (map.tap) {
        map.tap.enable();
      }
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.keyboard.disable();
      if (map.tap) {
        map.tap.disable();
      }
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { floor, pois } = this.props;
    if (pois.length === 0 && floor && floor !== prevProps.floor) {
      fitMapBounds(this.mapRef.current!, floor.floorPosition);
    }
    if (pois !== prevProps.pois && pois.length === 1) {
      fitMapBounds(
        this.mapRef.current!,
        pois.map((p) => convertPwLocationToLatLngTuple(p.location))
      );
    }
  }

  public get containerElement() {
    return document.getElementById('mapContainer')!;
  }

  public get leafletElement() {
    return this.mapRef.current!.leafletElement;
  }

  public get currentMap() {
    return this.mapRef.current;
  }

  public handleZoom() {
    if (this.currentMap && this.currentMap.leafletElement.getZoom()) {
      this.setState({ zoomLevel: this.currentMap.leafletElement.getZoom() });
    }
  }

  public render() {
    const { floor, markers, pois, style } = this.props;
    let locations: LatLngTuple[] = [];
    let position: LatLngTuple = [0, 0];
    if (markers.length === 1) {
      position = convertPwLocationToLatLngTuple(markers[0]);
    } else if (markers.length > 0) {
      locations = markers
        .filter((m) => m)
        .map((m) => convertPwLocationToLatLngTuple(m));
      position = getLatLngTupleCenter(locations);
    }
    const viewport: Viewport = {
      center: position,
      zoom: this.state.zoomLevel,
    };
    return (
      <div
        id="mapContainer"
        style={
          style || {
            height: '100%',
            minWidth: '100%',
            overflow: 'hidden',
          }
        }>
        <LeafletMap<MapProps & LooseObject>
          ref={this.mapRef}
          viewport={viewport}
          zoomControl={false}
          zoomAnimation={true}
          preferCanvas={true}
          minZoom={11}
          maxZoom={20}
          onZoomEnd={this.handleZoom}
          style={
            style || {
              height: '100%',
              minWidth: '100%',
              overflow: 'hidden',
            }
          }>
          <TileLayer
            attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL"
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          />
          {floor && (
            <RotImageOverlay
              url={floor.buildingSvg}
              bounds={floor.floorPosition}
            />
          )}
          {locations.map((location) => (
            <Marker position={location}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}
          {pois.map((poi) => (
            <MapPoi data={poi} subtitle={poi.name} key={poi.id} />
          ))}
        </LeafletMap>
      </div>
    );
  }
}
