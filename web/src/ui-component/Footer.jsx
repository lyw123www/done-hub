// material-ui
import { Container, Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const Footer = () => {
  const siteInfo = useSelector((state) => state.siteInfo);

  if (!siteInfo.footer_html) {
    return null;
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', borderRadius: 0 }}>
      <Box sx={{ textAlign: 'center' }}>
        <div className="custom-footer" dangerouslySetInnerHTML={{ __html: siteInfo.footer_html }}></div>
      </Box>
    </Container>
  );
};

export default Footer;
