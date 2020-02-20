import { AuditAttributes } from './AuditAttributes';

export interface Mall extends AuditAttributes {
  description?: string | null;
  id: number;
  stringId: string;
  buildingId: number;
  name: string;
  information?: string;
  timezone: string;
}
