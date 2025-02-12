import { css } from '@/../styled-system/css';
import { forwardRef } from 'react';

const dropdownContainer = css({
  position: 'absolute',
  top: '9rem',
  right: '1rem',
  width: '35rem',
  height: '30rem',
  borderRadius: 'lg',
  backgroundColor: 'white',
  boxShadow: 'dropDown',
  zIndex: '10000',
});

const CoverDropdown = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return <div ref={ref} className={dropdownContainer} {...props} />;
});

export default CoverDropdown;
