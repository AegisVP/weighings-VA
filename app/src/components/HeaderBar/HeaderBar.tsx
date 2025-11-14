import * as React from 'react';
import { Link, Navigate, NavLink, useNavigate } from 'react-router';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  type CircularProgressProps,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import { Loader } from '../Loader/Loader';
import { useAuth } from '../../hooks/useAuth';
import { menuLinks } from '../../router/sections';
import { MenuButtonWithFeatureCheck } from './MenuButton';

import type { TypeMenuItemDefinition } from '../../router/sections';

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
                          <ListItem key={page.name}>
                            <NavLink
                              to={page.link}
                              style={({ isActive }) => ({
                                textDecoration: isActive ? 'underline' : 'none',
                                fontWeight: isActive ? 'bold' : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                color: isActive ? 'blue' : 'inherit',
                                flexWrap: 'nowrap',
                              })}
                            >
                              {page.icon && <ListItemIcon color="inherit">{page.icon}</ListItemIcon>}
                              <ListItemText primary={page.name} style={{ textDecoration: 'inherit' }} />
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
                    <MenuButtonWithFeatureCheck
                      key={page.name}
                      page={page}
                      handleMenuNavigation={handleMenuNavigation}
                    />
                  ))}
              </Box>
            ) : null}
          </Box>

          {/* User menu */}
          {isLoggedIn ? (
            <Tooltip title={menuLinks.logout.name}>
              <Link
                to={menuLinks.logout.link}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Typography variant="h6" color="white" noWrap sx={{ cursor: 'pointer' }}>
                  {user.name}
                </Typography>
                <LogoutIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </Link>
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
