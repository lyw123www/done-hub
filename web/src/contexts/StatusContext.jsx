import { useEffect, useCallback, createContext } from 'react';
import { useDispatch } from 'react-redux';
import i18n from 'i18next';
import { API } from 'utils/api';
import { showNotice } from 'utils/common';
import { DEFAULT_BRAND_NAME, normalizeSiteInfo } from 'utils/branding';
import { SET_SITE_INFO } from 'store/actions';

export const LoadStatusContext = createContext();

// eslint-disable-next-line
const StatusProvider = ({ children }) => {
  const dispatch = useDispatch();

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
        if (i18n.language !== storedLanguage && i18n.resolvedLanguage !== storedLanguage) {
          i18n.changeLanguage(storedLanguage);
        }
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
          showNotice(i18n.t('common.unableServerTip', { version: normalizedData.version }));
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
  }, [dispatch]);

  useEffect(() => {
    loadStatus().then();
  }, [loadStatus]);

  return <LoadStatusContext.Provider value={loadStatus}> {children} </LoadStatusContext.Provider>;
};

export default StatusProvider;
