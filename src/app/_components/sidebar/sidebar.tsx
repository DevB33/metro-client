import { css } from '@/../styled-system/css';

import ProfileCard from './profile/profile-card';
import SideMenuCard from './side-menu/side-menu-card';
import FinderCard from './finder/finder-card';

const sideBar = css({
  width: '18rem',
  height: '100vh',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 'small',
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
