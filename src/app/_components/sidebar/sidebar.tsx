'use client';

import { useRef } from 'react';
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

const dragHandle = css({
  width: '1rem',
  cursor: 'col-resize',
});

const Sidebar = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const minWidth = 17;
  const maxWidth = 50;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = sideBarRef.current
      ? parseFloat(getComputedStyle(sideBarRef.current).width) / 16 // Convert px to rem
      : 20;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(
        Math.max(minWidth, startWidth + (moveEvent.clientX - startX) / 16),
        maxWidth,
      );
      if (sideBarRef.current) {
        sideBarRef.current.style.width = `${newWidth}rem`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className={sideBarContainer}>
      <div className={sideBar(minWidth)} ref={sideBarRef}>
        <ProfileCard />
        <SideMenuCard />
        <FinderCard />
      </div>
      <div className={dragHandle} onMouseDown={handleMouseDown} />
    </div>
  );
};

export default Sidebar;
