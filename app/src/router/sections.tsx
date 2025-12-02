import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import type { MessageDescriptor } from 'react-intl';

export type TypeMenuItemDefinition = {
  name: MessageDescriptor;
  link: string;
  showOnMenu?: boolean;
  feature?: string;
  icon?: React.ReactNode;
  action?: () => void;
};

export type TypeMenuItemDefinitions = Record<string, TypeMenuItemDefinition>;

export const menuLinks: TypeMenuItemDefinitions = {
  main: {
    name: { id: 'link.home', defaultMessage: 'Головна' },
    link: '/',
    showOnMenu: false,
    icon: <HomeIcon />,
  },
  weighing: {
    name: { id: 'link.weighings', defaultMessage: 'Зважування' },
    link: '/weighing',
    showOnMenu: true,
    feature: 'WEIGHING_ADD',
    icon: <ScaleIcon />,
  },
  reporting: {
    name: { id: 'link.analyze', defaultMessage: 'Аналіз' },
    link: '/reporting',
    showOnMenu: true,
    feature: 'DATA_ANALYZE',
    icon: <AssessmentIcon />,
  },
  settings: {
    name: { id: 'link.settings', defaultMessage: 'Налаштування' },
    link: '/settings',
    showOnMenu: true,
    feature: 'SETTINGS_CHANGE',
    icon: <SettingsIcon />,
  },
  login: {
    name: { id: 'link.login', defaultMessage: 'Вхід' },
    link: '/login',
    showOnMenu: false,
  },
  logout: {
    name: { id: 'link.logout', defaultMessage: 'Вийти' },
    link: '/logout',
    showOnMenu: false,
  },
};
