import { useEffect, useCallback, createContext } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import i18n from 'i18next';
import { API } from 'utils/api';
import { showNotice } from 'utils/common';
import { DEFAULT_BRAND_NAME, normalizeSiteInfo } from 'utils/branding';
import { SET_SITE_INFO, SET_MODEL_OWNEDBY } from 'store/actions';

export const LoadStatusContext = createContext();

const AUTH_ONLY_PATHS = new Set(['/login', '/register', '/reset', '/user/reset']);

// eslint-disable-next-line
const StatusProvider = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isAuthOnlyRoute = AUTH_ONLY_PATHS.has(pathname) || pathname.startsWith('/oauth/');

  const loadStatus = useCallback(async () => {
    let system_name = DEFAULT_BRAND_NAME;

    try {
      const res = await API.get('/api/status', { skipErrorHandler: true });
      const { success, data } = res.data;

      if (success) {
        const normalizedData = normalizeSiteInfo(data);
        if (!normalizedData.chat_link) {
          delete normalizedData.chat_link;
        }

        const storedLanguage = localStorage.getItem('appLanguage') || normalizedData.language || 'zh_CN';
        localStorage.setItem('default_language', storedLanguage);
        i18n.changeLanguage(storedLanguage);
        localStorage.setItem('siteInfo', JSON.stringify(normalizedData));
        localStorage.setItem('quota_per_unit', normalizedData.quota_per_unit);
        localStorage.setItem('display_in_currency', normalizedData.display_in_currency);
        dispatch({ type: SET_SITE_INFO, payload: normalizedData });

        if (
          normalizedData.version !== import.meta.env.VITE_APP_VERSION &&
          normalizedData.version !== 'v0.0.0' &&
          normalizedData.version !== '' &&
          import.meta.env.VITE_APP_VERSION !== ''
        ) {
          showNotice(t('common.unableServerTip', { version: normalizedData.version }));
        }

        system_name = normalizedData.system_name;
      } else {
        const backupSiteInfo = localStorage.getItem('siteInfo');
        if (backupSiteInfo) {
          const normalizedData = normalizeSiteInfo(JSON.parse(backupSiteInfo));
          system_name = normalizedData.system_name;
          localStorage.setItem('siteInfo', JSON.stringify(normalizedData));
          dispatch({
            type: SET_SITE_INFO,
            payload: normalizedData
          });
        }
      }
    } catch (error) {}

    localStorage.setItem('system_name', system_name);
    document.title = system_name;
  }, [dispatch, t]);

  const loadOwnedby = useCallback(async () => {
    if (isAuthOnlyRoute) {
      return;
    }

    try {
      const res = await API.get('/api/model_ownedby', { skipErrorHandler: true });
      const { success, data } = res.data;
      if (success) {
        dispatch({ type: SET_MODEL_OWNEDBY, payload: data });
      }
    } catch (error) {}
  }, [dispatch, isAuthOnlyRoute]);

  useEffect(() => {
    loadStatus().then();
    loadOwnedby();
  }, [loadStatus, loadOwnedby]);

  return <LoadStatusContext.Provider value={loadStatus}> {children} </LoadStatusContext.Provider>;
};

export default StatusProvider;
