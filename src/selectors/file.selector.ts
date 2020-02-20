import { FileDTO } from 'src/types/response/FileDTO';
import { getEntityById } from 'src/utils/selector.utils';

const entityName = 'files';

export const getfileById = getEntityById<FileDTO>(entityName);
