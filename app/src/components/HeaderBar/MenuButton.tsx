import { NavLink } from 'react-router';
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
    <NavLink
      key={page.name}
      to={page.link ?? '#'}
      onClick={handleMenuNavigation(page)}
      style={({ isActive }) => ({
        margin: '0',
        padding: '0.5rem 0.75rem',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        textDecorationLine: 'none',
        boxShadow: isActive ? 'inset 0 -2px 0 0 white' : 'none',
      })}
    >
      {page.name}
    </NavLink>
  );
