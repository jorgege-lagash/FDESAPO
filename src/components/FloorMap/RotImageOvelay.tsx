import L from 'leaflet';
import 'leaflet-imageoverlay-rotated';
import { MapLayer, withLeaflet } from 'react-leaflet';

const boundToLatLng = ([lat, lng]: [number, number]) => L.latLng(lat, lng);

class RotImageOverlay extends MapLayer<any, any> {
  public createLeafletElement(props: any) {
    const topleft = boundToLatLng(props.bounds[0]);
    const topright = boundToLatLng(props.bounds[1]);
    const bottomleft = boundToLatLng(props.bounds[3]);
    const el = (L.imageOverlay as any).rotated(
      props.url,
      topleft,
      topright,
      bottomleft,
      {
        opacity: 1,
        interactive: true,
        attribution: '',
      }
    );
    this.contextValue = { ...props.leaflet, popupContainer: el };

    return el;
  }

  public updateLeafletElement(fromProps: any, toProps: any) {
    if (toProps.url !== fromProps.url) {
      this.leafletElement.setUrl(toProps.url);
    }
    if (toProps.bounds !== fromProps.bounds) {
      const topleft = boundToLatLng(toProps.bounds[0]);
      const topright = boundToLatLng(toProps.bounds[1]);
      const bottomleft = boundToLatLng(toProps.bounds[3]);
      this.leafletElement.reposition(topleft, topright, bottomleft);
    }
    if (toProps.opacity !== fromProps.opacity) {
      this.leafletElement.setOpacity(toProps.opacity);
    }
    if (toProps.zIndex !== fromProps.zIndex) {
      this.leafletElement.setZIndex(toProps.zIndex);
    }
  }
}

export default withLeaflet(RotImageOverlay);
