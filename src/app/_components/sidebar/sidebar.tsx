'use client';

import { useRef, useState } from 'react';
import { css } from '@/../styled-system/css';

import ProfileCard from './profile/profile-card';
import SideMenuCard from './side-menu/side-menu-card';
import FinderCard from './finder/finder-card';
import SideBarResizeHandle from './sidebar-resize-handle';

const sideBarContainer = css({
  display: 'flex',
  width: 'auto',
  height: '100vh',
  marginRight: '1rem',
  transition: '0.3s',
});

const sideBar = css({
  minWidth: `17rem`,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '1rem 0 1rem 1rem',
  gap: 'small',
  backgroundColor: 'white',
  transition: '0.3s',
});

const Sidebar = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const startWidth = 17;
  const [isOpen, setIsOpen] = useState(true);

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    return savedWidth ? parseFloat(savedWidth) : startWidth;
  });

  return (
    <div
      className={sideBarContainer}
      // style={{
      //   transform: !isOpen ? `translateX(${-sidebarWidth}rem)` : 'none',
      // }}
    >
      <div
        className={sideBar}
        ref={sideBarRef}
        style={{ width: `${sidebarWidth}rem`, display: isOpen ? 'flex' : 'none' }}
        // style={{ width: `${sidebarWidth}rem` }}
        // style={{ width: isOpen ? `${sidebarWidth}rem` : '0rem', backgroundColor: 'gray' }}
      >
        <ProfileCard />
        <SideMenuCard />
        <FinderCard />
      </div>
      <SideBarResizeHandle
        sideBarRef={sideBarRef as React.RefObject<HTMLDivElement>}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Sidebar;
