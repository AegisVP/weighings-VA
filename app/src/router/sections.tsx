export type TypeMenuItemDefinition = {
  name: string;
  link: string;
  showOnMenu?: boolean;
  feature?: string;
  action?: () => void;
};

export type TypeMenuItemDefinitions = Record<string, TypeMenuItemDefinition>;

export const menuLinks: TypeMenuItemDefinitions = {
  main: { name: 'Головна', link: '/', showOnMenu: false },
  weighing: { name: 'Зважування', link: '/weighing', showOnMenu: true, feature: 'WEIGHING_ADD' },
  reporting: { name: 'Звітність', link: '/reporting', showOnMenu: true, feature: 'DATA_ANYLIZE' },
  settings: { name: 'Налаштування', link: '/settings', showOnMenu: true, feature: 'SETTINGS_CHANGE' },
  login: { name: 'Вхід', link: '/login', showOnMenu: false },
  logout: { name: 'Вихід', link: '/logout', showOnMenu: false },
};
