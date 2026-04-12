import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Drawer, Stack, useMediaQuery } from '@mui/material';

// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import MenuCard from './MenuCard';
import { drawerWidth } from 'store/constant';
import { useTranslation } from 'react-i18next';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window: windowProp }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const { t } = useTranslation();

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  const scrollAreaSx = useMemo(
    () => ({
      height: matchUpMd ? 'calc(100vh - 64px)' : '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'thin',
      px: 2,
      pt: matchUpMd ? 1 : 2.5,
      pb: 2,
      '&::-webkit-scrollbar': {
        width: '4px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        borderRadius: '4px'
      }
    }),
    [matchUpMd, theme.palette.mode]
  );

  const drawer = (
    <Box onWheel={handleScroll} onTouchMove={handleScroll} sx={scrollAreaSx}>
      {!matchUpMd && (
        <Box
          sx={{
            pb: 1.5,
            mt: 0.5,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >
          <LogoSection />
        </Box>
      )}

      <MenuCard />
      <MenuList />

      <Box
        sx={{
          pt: 2,
          pb: 2,
          mt: 2,
          borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
        }}
      >
        <Stack direction="row" justifyContent="center">
          <Chip
            label={import.meta.env.VITE_APP_VERSION || t('menu.unknownVersion')}
            disabled
            chipcolor="secondary"
            size="small"
            sx={{
              cursor: 'pointer',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? drawerWidth : 'auto'
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={windowProp?.document.body}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            transition: theme.transitions.create(['width', 'box-shadow'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            }),
            boxSizing: 'border-box',
            borderRadius: 0,
            [theme.breakpoints.up('md')]: {
              top: '64px',
              height: 'calc(100% - 64px)',
              boxShadow: 'none'
            },
            [theme.breakpoints.down('md')]: {
              top: '0',
              height: '100%',
              boxShadow: theme.shadows[8],
              zIndex: 1300
            },
            overflowX: 'hidden'
          },
          '& .MuiBackdrop-root': {
            [theme.breakpoints.down('md')]: {
              zIndex: 1290
            }
          }
        }}
        ModalProps={{
          keepMounted: true,
          closeAfterTransition: true
        }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
