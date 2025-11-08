import { Button } from '@mui/material';

import { userHasFeature } from '../../redux/user/userSlice';

import type { TypeMenuItemDefinition } from '../../router/sections';

type MenuButtonProps = {
  page: TypeMenuItemDefinition;
  handleMenuNavigation: (target: TypeMenuItemDefinition) => (e: React.MouseEvent) => void;
  children?: React.ReactNode;
};
export const MenuButtonWithFeatureCheck = ({ page, handleMenuNavigation, children }: MenuButtonProps) =>
  userHasFeature(page.feature) ? (
    <MenuButton page={page} handleMenuNavigation={handleMenuNavigation} children={children} />
  ) : null;

export const MenuButton = ({ page, handleMenuNavigation, children }: MenuButtonProps) =>
  children ? (
    children
  ) : (
    <Button
      key={page.name}
      component="a"
      href={page.link ?? '#'}
      onClick={handleMenuNavigation(page)}
      sx={{ my: 0, color: 'white', display: 'block' }}
    >
      {page.name}
    </Button>
  );
