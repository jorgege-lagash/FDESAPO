import { AuditAttributes } from '../AuditAttributes';
import { Mall } from '../Mall';

export interface MallPermission extends AuditAttributes {
  id: number;
  mall: Mall;
  name: string;
}
