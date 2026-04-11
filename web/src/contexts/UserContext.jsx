import React, { useCallback, useEffect, useRef, useState, createContext } from 'react';
import { useSelector } from 'react-redux';
import useLogin from 'hooks/useLogin';

export const UserContext = createContext();

// eslint-disable-next-line
const UserProvider = ({ children }) => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const account = useSelector((state) => state.account);
  const { loadUser: loadUserAction, loadUserGroup: loadUserGroupAction } = useLogin();
  const hasBootstrappedRef = useRef(false);

  const loadUser = useCallback(async () => {
    setIsUserLoaded(false);
    const user = await loadUserAction();
    setIsUserLoaded(true);
    return user;
  }, [loadUserAction]);

  const loadUserGroup = useCallback(async () => {
    return loadUserGroupAction();
  }, [loadUserGroupAction]);

  const bootstrapUser = useCallback(async () => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;
    setIsUserLoaded(false);

    const user = await loadUserAction();
    if (user) {
      await loadUserGroupAction();
    }

    setIsUserLoaded(true);
  }, [loadUserAction, loadUserGroupAction]);

  useEffect(() => {
    if (account.user) {
      setIsUserLoaded(true);
      return;
    }

    bootstrapUser().catch(() => {
      setIsUserLoaded(true);
    });
  }, [account.user, bootstrapUser]);

  return <UserContext.Provider value={{ loadUser, isUserLoaded, loadUserGroup }}>{children}</UserContext.Provider>;
};

export default UserProvider;
