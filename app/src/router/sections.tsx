import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

export type TypeMenuItemDefinition = {
  name: string;
  link: string;
  showOnMenu?: boolean;
  feature?: string;
  icon?: React.ReactNode;
  action?: () => void;
};

export type TypeMenuItemDefinitions = Record<string, TypeMenuItemDefinition>;

export const menuLinks: TypeMenuItemDefinitions = {
  main: {
    name: 'Головна',
    link: '/',
    showOnMenu: false,
    icon: <HomeIcon />,
  },
  weighing: {
    name: 'Зважування',
    link: '/weighing',
    showOnMenu: true,
    feature: 'WEIGHING_ADD',
    icon: <ScaleIcon />,
  },
  reporting: {
    name: 'Аналіз',
    link: '/reporting',
    showOnMenu: true,
    feature: 'DATA_ANALYZE',
    icon: <AssessmentIcon />,
  },
  settings: {
    name: 'Налаштування',
    link: '/settings',
    showOnMenu: true,
    feature: 'SETTINGS_CHANGE',
    icon: <SettingsIcon />,
  },
  login: {
    name: 'Вхід',
    link: '/login',
    showOnMenu: false,
  },
  logout: {
    name: 'Вихід',
    link: '/logout',
    showOnMenu: false,
  },
};
