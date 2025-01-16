'use client';

import { useState } from 'react';
import { css } from '@/../styled-system/css';

import ProfileCard from './profile/profile-card';
import SideMenuCard from './sied-menu/side-menu-card';
import FinderCard from './finder/finder-card';

const sideBarContainer = css({
  display: 'flex',
  width: 'auto',
  height: '100vh',
});

const sideBar = (width: number) =>
  css({
    width: `${width}rem`,
    minWidth: `17rem`,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '1rem 0 1rem 1rem',
    gap: 'small',
    backgroundColor: 'white',
  });

const dragHandleStyle = css({
  width: '1rem',
  cursor: 'col-resize',
});

const Sidebar = () => {
  const [width, setWidth] = useState(20);
  return (
    <div className={sideBarContainer}>
      <div className={sideBar(width)}>
        <ProfileCard />
        <SideMenuCard />
        <FinderCard />
      </div>
      <div className={dragHandleStyle} />
    </div>
  );
};

export default Sidebar;
