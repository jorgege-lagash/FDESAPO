import { AuditAttributes } from '../AuditAttributes';

export interface Zone extends AuditAttributes {
  id: number;
  mallId: number;
  name: string;
  description: string;
}
