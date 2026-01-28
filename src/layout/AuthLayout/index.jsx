import React from 'react';
import { Layout, Row, Col } from 'antd';

import { useSelector } from 'react-redux';
import { Content } from 'antd/lib/layout/layout';

export default function AuthLayout({ sideContent, children }) {
  return (
             <>
          {children}
             </>
        
  );
}
