'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { css } from '@/../styled-system/css';

import ProfileCard from './profile/profile-card';
import SideMenuCard from './side-menu/side-menu-card';
import FinderCard from './finder/finder-card';
import SideBarResizeHandle from './sidebar-resize-handle';

const sideBarContainer = css({
  display: 'flex',
  width: 'auto',
  height: '100vh',
  marginRight: '.1rem',
  transition: '0.3s',
  userSelect: 'none',
});

const sideBar = css({
  minWidth: '17rem',
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
  const savedWidth = localStorage.getItem('sidebarWidth');
  const startWidth = 17;
  const sidebarWidth = savedWidth ? parseFloat(savedWidth) : startWidth;
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  if (pathname.startsWith('/note/share')) {
    return null;
  }

  return (
    <div className={sideBarContainer}>
      <div
        id="sidebar"
        className={sideBar}
        ref={sideBarRef}
        style={{ width: `${sidebarWidth}rem`, display: isOpen ? 'flex' : 'none' }}
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
