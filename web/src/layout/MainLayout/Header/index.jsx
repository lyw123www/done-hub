import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Stack } from '@mui/material';

import LogoSection from '../LogoSection';
import Profile from './Profile';
import ThemeButton from 'ui-component/ThemeButton';
import I18nButton from 'ui-component/i18nButton';
import { NoticeButton } from 'ui-component/notice';

const Header = ({ handleLeftDrawerToggle, toggleProfileDrawer }) => {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const location = useLocation();
  const isConsoleRoute = location.pathname.startsWith('/panel');

  return (
    <>
      <Box
        sx={{
          width: isDrawerOpen ? 220 : 88,
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box
          component="span"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            flexGrow: 1,
            minWidth: 0,
            maxWidth: isDrawerOpen ? 168 : 44,
            mr: 1.5
          }}
        >
          <LogoSection compact={!isDrawerOpen} />
        </Box>
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            width: '38',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
            },
            transition: 'background-color 0.2s ease-in-out'
          }}
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
            handleLeftDrawerToggle();
          }}
        >
          <Icon
            icon={isDrawerOpen ? 'tabler:layout-sidebar-right-collapse' : 'tabler:layout-sidebar-left-expand'}
            width="22px"
            height="22px"
            color={theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.primary}
          />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" spacing={1} alignItems="center">
        <NoticeButton />
        <ThemeButton />
        <I18nButton />
        {isConsoleRoute && <Profile toggleProfileDrawer={toggleProfileDrawer} />}
      </Stack>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
  toggleProfileDrawer: PropTypes.func
};

export default Header;
