import category from './category';
import day from './day';
import deal from './deal';
import defaultMessages from './default';
import event from './event-directory';
import featuredSpace from './featured-space';
import login from './login';
import mall from './mall';
import store from './store';
import validation from './validation';
import zone from './zone';
import poiMallZone from './poi-mall-zone';

export default {
  default: defaultMessages,
  headerHelpMessage: {
    defaultMessage: 'Ayuda',
    id: 'component.globalHeader.help',
  },
  day,
  login,
  mall,
  store,
  zone,
  category,
  validation,
  featuredSpace,
  deal,
  event,
  poiMallZone,
};
