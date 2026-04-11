import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonBase, Box } from '@mui/material';

import Logo from 'ui-component/Logo';
import { MENU_OPEN } from 'store/actions';

const LogoSection = ({ compact = false }) => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();

  return (
    <ButtonBase
      disableRipple
      aria-label="返回首页"
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to="/price"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minWidth: 0,
        maxWidth: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          opacity: 0.9
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, maxWidth: '100%' }}>
        <Logo compact={compact} />
      </Box>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  compact: PropTypes.bool
};

export default LogoSection;
