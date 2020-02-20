declare var moment: typeof import('moment');
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
import * as _moment from 'moment';
export as namespace moment;
export = _moment;
