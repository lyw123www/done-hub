import PropTypes from 'prop-types';

import logoLight from 'assets/images/logo.svg';
import logoDark from 'assets/images/logo-white.svg';
import logoMarkLight from 'assets/images/logo-mark.svg';
import logoMarkDark from 'assets/images/logo-mark-white.svg';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { normalizeBrandName, resolveBrandLogo } from 'utils/branding';

const Logo = ({ compact = false, height }) => {
  const siteInfo = useSelector((state) => state.siteInfo);
  const theme = useTheme();
  const defaultLogo = theme.palette.mode === 'light' ? (compact ? logoMarkLight : logoLight) : compact ? logoMarkDark : logoDark;
  const brandName = normalizeBrandName(siteInfo.system_name);
  const logoToDisplay = resolveBrandLogo(siteInfo.logo, defaultLogo);

  return (
    <img
      src={logoToDisplay}
      alt={brandName}
      height={height || (compact ? 40 : 46)}
      loading="eager"
      draggable="false"
      style={{ display: 'block', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
    />
  );
};

Logo.propTypes = {
  compact: PropTypes.bool,
  height: PropTypes.number
};

export default Logo;
