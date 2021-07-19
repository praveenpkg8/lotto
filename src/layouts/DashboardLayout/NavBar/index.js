import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Lock as LockIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
  Settings as SettingsIcon
} from 'react-feather';
import ListAltIcon from '@material-ui/icons/ListAlt';
import NavItem from './NavItem';

const user = {
  jobTitle: 'Role',
  name: 'Agent Name'
};
const handleLogout = () => {
  localStorage.clear();
};

const items = [
  {
    href: '/app/purchaseticket',
    icon: ShoppingBagIcon,
    title: 'Purchase Tickets'
  },

  {
    href: '/app/winningnumbers',
    icon: UsersIcon,
    title: 'Winning Number'
  },
  {
    href: '/app/winningcalculation',
    icon: ListAltIcon,
    title: 'Winning calculation'
  },
  {
    href: '/app/ticketsettings',
    icon: SettingsIcon,
    title: 'Ticket Settings'
  },

  {
    href: '/login',
    icon: LockIcon,
    title: 'Logout',
    onclick: handleLogout
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  // useEffect(() => {
  //   if (openMobile && onMobileClose) {
  //     onMobileClose();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/app/dashboard"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              onClick={item.onclick}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
