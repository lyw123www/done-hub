import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Drawer, Stack, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

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
  const scrollbarRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const updateScrollbar = useCallback(() => {
    if (!scrollbarRef.current?.ps) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollbarRef.current?.ps?.update();
    });
  }, []);

  const setScrollbarContainerRef = useCallback((ref) => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    scrollbarRef.current = ref;

    if (!ref || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      ref.ps?.update();
    });

    resizeObserver.observe(ref);
    resizeObserverRef.current = resizeObserver;
  }, []);

  useEffect(() => {
    updateScrollbar();
    const timer = window.setTimeout(updateScrollbar, 180);

    return () => {
      window.clearTimeout(timer);
    };
  }, [drawerOpen, updateScrollbar]);

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  const drawer = (
    <>
      <BrowserView>
        <Box
          onWheel={handleScroll}
          onTouchMove={handleScroll}
          sx={{
            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 64px)',
            position: 'relative'
          }}
        >
          <PerfectScrollbar
            component="div"
            options={{
              wheelPropagation: false,
              suppressScrollX: true,
              minScrollbarLength: 40,
              maxScrollbarLength: 100,
              updateOnWindowResize: true
            }}
            style={{
              height: '100%',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '16px'
            }}
            containerRef={setScrollbarContainerRef}
          >
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
          </PerfectScrollbar>
        </Box>
      </BrowserView>
      <MobileView>
        <Box
          sx={{
            height: '100vh',
            position: 'relative'
          }}
        >
          <Box
            component="div"
            onWheel={handleScroll}
            onTouchMove={handleScroll}
            sx={{
              height: '100%',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              display: 'flex',
              flexDirection: 'column',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }
            }}
          >
            <Box
              sx={{
                px: 2,
                pt: 2.5,
                pb: 1.5,
                mt: 0.5,
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              <LogoSection />
            </Box>

            <Box
              sx={{
                px: 2,
                pt: 1,
                pb: 2,
                flex: 1
              }}
            >
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
          </Box>
        </Box>
      </MobileView>
    </>
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
