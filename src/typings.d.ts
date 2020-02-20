declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.scss' {
  const content: any;
  export = content;
}

declare module '*.less' {
  const content: any;
  export = content;
}

declare module 'leaflet-image' {
  import { Map } from 'leaflet';
  type leafletImageCallback = (err: any, canvas: HTMLCanvasElement) => void;
  export default function leafletImage(
    map: Map,
    callback: leafletImageCallback
  ): void;
}

declare module 'react-leaflet-canvas-layer' {
  import { Component } from 'react';
  interface Info {
    map: any;
    canvas: any;
    bounds: any;
    size: any;
    zoom: any;
    center: any;
    corner: any;
    data: any;
  }
  interface Props {
    drawMethod: (info: Info) => void;
  }
  export default class CanvasLayer extends Component<Props> {}
}

declare module 'ckeditor4-react' {
  const content: any;
  export = content;
}

declare module 'lethargy' {
  export class Lethargy {
    public stability: number;
    public sensitivity: number;
    public tolerance: number;
    public delay: number;
    lastUpDeltas: number[];
    lastDownDeltas: number[];
    deltasTimestamp: number[];
    constructor(
      stability?: number,
      sensitivity?: number,
      tolerance?: number,
      delay?: number
    );
    public check(e: any): boolean;
  }
}
