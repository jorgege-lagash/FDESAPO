export enum FileCategory {
  poiLogo = 'poiLogo',
  poiScreenshot = 'poiScreenshot',
  featureSpace = 'featureSpace',
  travelerDiscount = 'travelerDiscount',
  dealPicture = 'dealPicture',
  eventDirectory = 'eventDirectory',
}
export interface FileDTO {
  id: number;
  name: string;
  url: string;
  contentType: string;
  uploaderId: number;
  uploaderType: string;
  fileCategoryId: number;
  mallId: number;
  created: string;
  modified: string;
}

export interface SignedFileRequestDTO {
  filename: string;
  contentType: string;
  fileCategory: FileCategory;
}

export interface SignedFileResponseDTO {
  id: number;
  signedRequest: string;
  url: string;
}

export interface UploadedFileResult {
  id: number;
  filename: string;
  contentType: string;
  fileCategory: FileCategory;
  url: string;
}
