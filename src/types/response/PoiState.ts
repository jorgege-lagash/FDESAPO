export interface PoiState {
  id: number;
  name: string;
}

export enum PoiStateValues {
  enabled = 1,
  disabled = 2,
  inMakeover = 3,
  comingSoon = 4,
  draft = 5,
}
