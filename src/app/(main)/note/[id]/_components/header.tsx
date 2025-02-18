'use client';

import { css } from '@/../styled-system/css';

import LeftArrowIcon from '@/icons/left-arrow-icon';
import RightArrowIcon from '@/icons/right-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';

const headerConatiner = css({
  boxSizing: 'border-box',
  width: 'full',
  paddingTop: 'small',
  px: 'small',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const leftItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const rightItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const Header = () => {
  // const sidebarWidth = localStorage.getItem('sidebarWidth');
  // const defaultSidebarWidth = 17;
  // const sidebarPadding = 2;
  // const coverWidth = sidebarWidth
  //   ? `calc(100vw - ${sidebarWidth}rem - ${sidebarPadding}rem)`
  //   : `calc(100vw - ${defaultSidebarWidth}rem - ${sidebarPadding}rem)`;
  return (
    <div className={headerConatiner} style={{ width: '100%' }}>
      <div className={leftItemsConatiner}>
        <LeftArrowIcon />
        <RightArrowIcon />
      </div>
      <div className={rightItemsConatiner}>
        <div>공유</div>
        <HorizonDotIcon />
      </div>
    </div>
  );
};

export default Header;
