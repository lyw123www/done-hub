import { useMemo } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useIsAdmin } from 'utils/common';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST ||============================== //
const MenuList = () => {
  const userIsAdmin = useIsAdmin();
  const { t } = useTranslation();
  const siteInfo = useSelector((state) => state.siteInfo);

  const translateMenuNode = (item) => {
    const nextItem = {
      ...item,
      title: t(item.id)
    };

    if (item.children?.length) {
      nextItem.children = item.children.map(translateMenuNode);
    }

    return nextItem;
  };

  const menuGroups = useMemo(() => menuItem.items.map(translateMenuNode), [t]);

  return (
    <>
      {menuGroups.map((item) => {
        if (item.type !== 'group') {
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              {t('menu.error')}
            </Typography>
          );
        }

        const filteredChildren = item.children.filter(
          (child) =>
            (!child.isAdmin || userIsAdmin) &&
            !(siteInfo.UserInvoiceMonth === false && child.id === 'invoice') &&
            !(siteInfo.builtin_chat_enabled === false && child.id === 'playground')
        );

        if (filteredChildren.length === 0) {
          return null;
        }

        return <NavGroup key={item.id} item={{ ...item, children: filteredChildren }} />;
      })}
    </>
  );
};

export default MenuList;
