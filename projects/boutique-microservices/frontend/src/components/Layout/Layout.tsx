import React from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Home,
  ShoppingBag,
  Menu as MenuIcon,
  ReceiptLong,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

const drawerWidth = 220;

const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'All Products', path: '/products', icon: <ShoppingBag /> },
  ];

  if (isAuthenticated) {
    navItems.push(
      { label: 'My Orders', path: '/orders', icon: <ReceiptLong /> },
      { label: 'My Profile', path: '/profile', icon: <Person /> }
    );
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ borderBottom: '1px solid #E5E7EB', px: 2 }}>
        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          onClick={() => setMobileOpen(false)}
          sx={{ fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', color: 'inherit' }}
        >
          Flowstack
        </Typography>
      </Toolbar>
      <List sx={{ p: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive ? '#F3F4F6' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{ fontWeight: 700, fontSize: '1rem', textDecoration: 'none', color: 'inherit' }}
            >
              Flowstack Store
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={() => navigate('/cart')} title="Cart">
              <Badge badgeContent={itemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            {isAuthenticated ? (
              <IconButton color="inherit" onClick={logout} title="Logout">
                <AccountCircle />
              </IconButton>
            ) : (
              <IconButton color="inherit" onClick={() => navigate('/login')} title="Login">
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
