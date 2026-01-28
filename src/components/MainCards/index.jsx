import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { Card, Divider } from 'antd';

const MainCard = forwardRef(
  (
    {
      children,
      content = true,
      contentSX = {},
      divider = true,
      secondary,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        title={title ? <span style={{ fontSize: '1rem', fontWeight: 500 }}>{title}</span> : null}
        extra={secondary}
        bordered={true}
        style={{
          position: 'relative',
          borderRadius: '12px',
          border: '1px solid #f0f0f0',
          ...sx,
        }}
        bodyStyle={{
          padding: content ? '20px' : 0,
          ...contentSX,
        }}
      >
        {title && divider && <Divider style={{ margin: '12px 0' }} />}
        {children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  contentSX: PropTypes.object,
  divider: PropTypes.bool,
  secondary: PropTypes.node,
  content: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  sx: PropTypes.object,
  children: PropTypes.node,
};

export default MainCard;
