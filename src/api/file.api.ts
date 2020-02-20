import {
  FileCategory,
  SignedFileRequestDTO,
  SignedFileResponseDTO,
  UploadedFileResult,
} from 'src/types/response/FileDTO';
import { addMallHeader, HttpService } from 'src/utils/request';

// ! File upload flow
// * 1. Create a S3Signature => it will return file { id, signedUrl}
// * 2. upload to S3 using the signed url
// * 3. confirm file upload using the fileId and the  link endpoint. EX: pois/:id/files/:fileId/link

const getSignedS3Url = (
  mallId: number,
  fileData: SignedFileRequestDTO
): Promise<SignedFileResponseDTO> => {
  const mallHeader = addMallHeader(mallId);
  return HttpService.post<SignedFileResponseDTO>(
    'files/s3-signature',
    fileData,
    {},
    mallHeader
  );
};
const uploadFileToS3 = async (data: File, signedRequest: string) => {
  const options = {
    method: 'PUT',
    body: data,
  };
  const response = await fetch(signedRequest, options);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response;
};

const handleFileUpload = async (
  mallId: number,
  fileData: File,
  fileCategory: FileCategory
): Promise<UploadedFileResult> => {
  const type = fileData.type;
  const filename = fileData.name;
  const data: SignedFileRequestDTO = {
    contentType: type,
    fileCategory,
    filename,
  };
  const signedUrlData = await getSignedS3Url(mallId, data);
  await uploadFileToS3(fileData, signedUrlData.signedRequest);
  return {
    id: signedUrlData.id,
    filename,
    fileCategory,
    contentType: type,
    url: signedUrlData.url,
  };
};

export const file = {
  handleFileUpload,
};
