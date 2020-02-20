import {
  category,
  deal,
  event,
  featuredSpace,
  mall,
  poi,
  poiMallZone,
  // user,
  // zone,
} from '../../constants/permissions';

export interface SideMenuItem {
  label: string;
  translationKey?: string;
  code?: string;
  iconType?: string;
  path?: string;
  hideInMenu?: boolean;
  target?: string;
  isDependentOnMall?: boolean;
  requiredPermissions?: string[];
  children?: SideMenuItem[];
}

export const menuConfig: SideMenuItem[] = [
  // {
  //   iconType: 'team',
  //   label: 'Usuarios',
  //   path: '/cms/users',
  //   requiredPermissions: [user.create],
  //   children: [
  //     {
  //       requiredPermissions: [user.create],
  //       label: 'Crear',
  //       path: '/cms/users/create',
  //     },
  //   ],
  // },
  {
    iconType: 'bank',
    label: 'Malls',
    path: '/cms/malls/list',
    requiredPermissions: [mall.list],
  },
  {
    iconType: 'cluster',
    label: 'Categorias',
    isDependentOnMall: true,
    path: '/categories/list',
    requiredPermissions: [category.list],
  },
  {
    requiredPermissions: [poiMallZone.list],
    label: 'Zonas Horarias',
    isDependentOnMall: true,
    path: '/poiMallZone/list',
    iconType: 'clock-circle',
  },
  // {
  //   iconType: 'layout',
  //   label: 'Zonas',
  //   isDependentOnMall: true,
  //   requiredPermissions: [zone.list],
  //   path: '/zones/list',
  // },
  {
    iconType: 'shop',
    label: 'POIs',
    isDependentOnMall: true,
    path: '/pois',
    code: 'poi',
    children: [
      {
        requiredPermissions: [poi.list],
        label: 'Lista',
        isDependentOnMall: true,
        path: '/pois/list',
        code: 'poi.list',
      },
      {
        requiredPermissions: [poi.create],
        label: 'Crear',
        isDependentOnMall: true,
        path: '/pois/create',
        code: 'poi.create',
      },
      {
        requiredPermissions: [poi.create],
        label: 'Tipos',
        isDependentOnMall: true,
        path: '/pois/list/types',
        code: 'poi.types',
      },
    ],
  },
  {
    iconType: 'star',
    label: 'Espacios publicitarios',
    isDependentOnMall: true,
    path: '/featured-space/list',
    requiredPermissions: [featuredSpace.list],
  },
  // {
  //   iconType: 'shopping',
  //   label: 'Ofertas',
  //   isDependentOnMall: true,
  //   path: '/deals',
  //   children: [
  //     {
  //       requiredPermissions: [featuredSpace.list],
  //       label: 'Lista',
  //       isDependentOnMall: true,
  //       path: '/deals/list',
  //     },
  //     {
  //       requiredPermissions: [featuredSpace.create],
  //       label: 'Crear',
  //       isDependentOnMall: true,
  //       path: '/deals/create',
  //     },
  //   ],
  // },
  {
    iconType: 'calendar',
    label: 'Eventos',
    isDependentOnMall: true,
    path: '/events/list',
    requiredPermissions: [event.list],
  },
  {
    iconType: 'tags',
    label: 'Ofertas',
    isDependentOnMall: true,
    path: '/deals/list',
    requiredPermissions: [deal.list],
  },
  // {
  //   iconType: 'exception',
  //   label: 'Paginas de error',
  //   path: '/cms/exception',
  //   children: [
  //     {
  //       label: '403 Prohibido',
  //       path: '/cms/403',
  //     },
  //     {
  //       label: '404 No Encontrado',
  //       path: '/cms/404',
  //     },
  //     {
  //       label: '500 Server Error',
  //       path: '/cms/500',
  //     },
  //   ],
  // },
];
