import { css } from '@/../styled-system/css';

import ProfileCard from './profile-card';
import SideMenuCard from './side-menu-card';
import FinderCard from './finder-card';

const sideBar = css({
  width: '18rem',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '1rem',
  gap: 'small',
  backgroundColor: 'white',
});

const Sidebar = () => {
  return (
    <div className={sideBar}>
      <ProfileCard />
      <SideMenuCard />
      <FinderCard />
    </div>
  );
};

export default Sidebar;
