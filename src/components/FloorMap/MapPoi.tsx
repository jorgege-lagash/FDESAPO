import React, { Component } from 'react';

import { divIcon } from 'leaflet';
import isEmpty from 'lodash/isEmpty';
import { Marker } from 'react-leaflet';
import { APPCONFIG } from 'src/constants/config';
import { PwPoi } from 'src/types/response/PwPoi';

interface Props {
  data: PwPoi;
  tooltipText: string;
  tooltipClass: string;
  floorName: string;
  showLabel: boolean;
  subtitle: string;
  onPoiClick: (poiId: number) => void;
}

const defaultProps = {
  tooltipText: '',
  tooltipClass: '',
  floorName: '',
  showLabel: true,
  subtitle: '',
  onPoiClick: (poiId: number) => {
    return;
  },
};
const defaultMarker = `${APPCONFIG.env.publicUrl}/blue-marker.png`;
export default class MapPoi extends Component<Props> {
  public static readonly defaultProps = defaultProps;
  constructor(props: Props) {
    super(props);
    this.handlePoiClick = this.handlePoiClick.bind(this);
  }

  public handlePoiClick() {
    return this.props.onPoiClick(this.props.data.id);
  }

  public render() {
    const {
      data: { location, name, customIconImageUrl },
      showLabel,
      tooltipText,
      tooltipClass,
    } = this.props;
    let position: [number, number] = [0, 0];

    if (location && location.latitude) {
      position = [location.latitude, location.longitude];
    }

    if (isEmpty(position)) {
      return null;
    }
    const iconTextStyle =
      'position: absolute; bottom: -30px;width: 200px;text-align: center;left: -81px;text-shadow:1px 1px #fff;font-size: 14px;line-height:1.05';
    let html = `<img alt=${name} src=${customIconImageUrl ||
      defaultMarker} class="leaflet-marker-icon leaflet-zoom-animated leaflet-clickable map-poi-icon" title="${name}" style="width: 40px; height: 40px; object-fit: contain;"/>`;
    if (showLabel) {
      html += `<p style="${iconTextStyle}">${name}</p>`;
    }
    if (tooltipText) {
      // html += `<span class="poi-tooltip ${metaData.tooltipClass || ''}"> ${metaData.tooltipText} </span>`
      const printClass = tooltipText.toLowerCase() || '';
      // Code to add SVG to avoid black print in the IE and Firefox browsers
      html += `<span class="poi-tooltip ${printClass} ${tooltipClass || ''}">
      <svg viewBox="0 0 40 16" xmlns="http://www.w3.org/2000/svg">
        <text class="svg-text">${tooltipText}</text>
      </svg>
      <span class="poi-text">${tooltipText}</span>
    </span>`;
    }
    const icon = divIcon({
      className: 'my-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      html,
    });
    return (
      <Marker
        position={position}
        title={name}
        icon={icon}
        onClick={this.handlePoiClick}
      />
    );
  }
}
