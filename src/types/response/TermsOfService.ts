import { AuditAttributes } from '../AuditAttributes';

export interface TermsOfService extends AuditAttributes {
  text: string;
  id: number;
  mallId: number;
  tag: string;
  active: boolean;
}
