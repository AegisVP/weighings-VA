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
  ListItemText,
  Tooltip,
  type CircularProgressProps,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigate, NavLink, useNavigate } from 'react-router';

import { Loader } from '../Loader/Loader';
import { useAuth } from '../../hooks/useAuth';
import { menuLinks } from '../../router/sections';

import type { TypeMenuItemDefinition } from '../../router/sections';
import { MenuButtonWithFeatureCheck } from './MenuButton';

export const HeaderBar = () => {
  const [open, setOpen] = React.useState(false);
  const { isLoggedIn, isRefreshing, user } = useAuth();
  const navigate = useNavigate();

  const LOGO = 'Vital-AGRO';

  const handleMenuNavigation = (target: TypeMenuItemDefinition) => (e: React.MouseEvent) => {
    e.preventDefault();
    if ('link' in target && typeof target.link === 'string') {
      navigate(target.link);
    } else if ('action' in target && typeof target.action === 'function') {
      target.action();
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  if ((!isLoggedIn && !isRefreshing) || !user) {
    return <Navigate to={menuLinks.login.link} />;
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
                    {Object.values(menuLinks)
                      .filter((p) => p.showOnMenu)
                      .map((page) => (
                        <MenuButtonWithFeatureCheck
                          key={page.name}
                          page={page}
                          handleMenuNavigation={handleMenuNavigation}
                        >
                          <ListItem key={page.name} disablePadding>
                            <NavLink to={page.link}>
                              <ListItemText primary={page.name} />
                            </NavLink>
                          </ListItem>
                        </MenuButtonWithFeatureCheck>
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
              href={menuLinks.main.link}
              onClick={handleMenuNavigation(menuLinks.main)}
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
                {Object.values(menuLinks)
                  .filter((p) => p.showOnMenu)
                  .map((page) => (
                    <MenuButtonWithFeatureCheck key={page.name} page={page} handleMenuNavigation={handleMenuNavigation}>
                      <Button
                        key={page.name}
                        component="a"
                        href={page.link ?? '#'}
                        onClick={handleMenuNavigation(page)}
                        sx={{ my: 0, color: 'white', display: 'block' }}
                      >
                        {page.name}
                      </Button>
                    </MenuButtonWithFeatureCheck>
                  ))}
              </Box>
            ) : null}
          </Box>

          {/* User menu */}
          {isLoggedIn ? (
            <Tooltip title={menuLinks.logout.name}>
              <NavLink to={menuLinks.logout.link}>
                <Typography variant="h6" color="white" noWrap sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                  {user.name}
                </Typography>
              </NavLink>
            </Tooltip>
          ) : isRefreshing ? (
            <Loader color={'white' as CircularProgressProps['color']} size={24} />
          ) : (
            <Navigate to={menuLinks.main.link} />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
