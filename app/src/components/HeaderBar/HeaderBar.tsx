import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  type CircularProgressProps,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigate, useNavigate } from 'react-router';
import { Loader } from '../Loader/Loader';
import { useAuth } from '../../hooks/useAuth';

type TypeMenuItemDefinition = {
  name: string;
  link?: string;
  action?: () => void;
};
const pages: TypeMenuItemDefinition[] = [
  { name: 'Зважування', link: '/weighing' },
  { name: 'Звітність', link: '/reporting' },
  { name: 'Налаштування', link: '/settings' },
];
const logoutMenuItem: TypeMenuItemDefinition = { name: 'Вихід', link: '/logout' };

export const HeaderBar = () => {
  const [open, setOpen] = React.useState(false);
  const { isLoggedIn, isRefreshing, user } = useAuth();
  const navigate = useNavigate();

  const LOGO = 'Vital-AGRO';

  const handleMenuNavigation = (target: TypeMenuItemDefinition) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (!('action' in target) && 'link' in target && typeof target.link === 'string') {
      navigate(target.link);
    } else if (!('link' in target) && 'action' in target && typeof target.action === 'function') {
      target.action();
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  if ((!isLoggedIn && !isRefreshing) || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <AppBar component="header" position="static" sx={{ mb: 2, flexGrow: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu button */}
          {isLoggedIn ? (
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Drawer component="nav" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                  <List>
                    {pages.map((page) => (
                      <ListItem key={page.name} disablePadding>
                        <ListItemButton component="a" href={page.link ?? '#'} onClick={handleMenuNavigation(page)}>
                          <ListItemText primary={page.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </Box>
          ) : null}

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            {/* Logo */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              onClick={handleMenuNavigation({ name: 'Home', link: '/' })}
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {LOGO}
            </Typography>

            {/* Navigation buttons */}
            {isLoggedIn ? (
              <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    component="a"
                    href={page.link ?? '#'}
                    onClick={handleMenuNavigation(page)}
                    sx={{ my: 0, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>
            ) : null}
          </Box>

          {/* User menu */}
          {isLoggedIn ? (
            <Tooltip title={logoutMenuItem.name}>
              <Typography
                variant="h6"
                color="white"
                noWrap
                component="a"
                href={logoutMenuItem.link}
                onClick={handleMenuNavigation(logoutMenuItem)}
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                {user.name}
              </Typography>
            </Tooltip>
          ) : isRefreshing ? (
            <Loader color={'white' as CircularProgressProps['color']} size={24} />
          ) : (
            <Navigate to="/logout" />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
