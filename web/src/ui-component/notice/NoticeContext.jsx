import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';
import { useLocation } from 'react-router-dom';

import { API } from 'utils/api';

export const NoticeContext = createContext(undefined);

const AUTH_ONLY_PATHS = new Set(['/login', '/register', '/reset', '/user/reset']);

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { pathname } = useLocation();
  const isAuthOnlyRoute = AUTH_ONLY_PATHS.has(pathname) || pathname.startsWith('/oauth/');

  const openNotice = async () => {
    if (!isLoaded && !isAuthOnlyRoute) {
      await checkNotice();
    }
    setOpen(true);
  };
  const closeNotice = () => setOpen(false);

  const checkNotice = useCallback(async () => {
    if (typeof window !== 'undefined') {
      // 确保代码只在客户端执行
      try {
        const noticeMsg = await getNotice();
        const oldNotice = localStorage.getItem('notice');

        const processAndSetNotice = async (content) => {
          setNotice(content);
          if (content !== oldNotice) {
            setOpen(true);
            localStorage.setItem('notice', content || '');
          }
        };

        if (noticeMsg !== oldNotice && noticeMsg) {
          await processAndSetNotice(noticeMsg);
        } else if (oldNotice) {
          await processAndSetNotice(oldNotice);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch notice:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthOnlyRoute) {
      setNotice(null);
      setOpen(false);
      setIsLoaded(false);
      return;
    }
  }, [isAuthOnlyRoute]);

  const memoizedValue = useMemo(
    () => ({
      notice,
      isOpen,
      openNotice,
      closeNotice
    }),
    [notice, isOpen]
  );

  return <NoticeContext.Provider value={memoizedValue}>{children}</NoticeContext.Provider>;
}

NoticeProvider.propTypes = {
  children: PropTypes.node
};

export function useNotice() {
  const context = useContext(NoticeContext);

  if (context === undefined) {
    throw new Error('useNotice must be used within a NoticeProvider');
  }

  return context;
}

async function getNotice() {
  try {
    const res = await API.get('/api/notice', { skipErrorHandler: true });
    const { success, data } = res.data;

    if (!success) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching notice:', error);

    return null;
  }
}
