import { css } from '@/../styled-system/css';

import SettingIcon from '@/icons/setting-icon';
import SearchIcon from '@/icons/search-icon';
import HomeIcon from '@/icons/home-icon';
import PageOpenIcon from '@/icons/page-open-icon';
import PageCloseIcon from '@/icons/page-close-icon';

const sideBar = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '18rem',
  height: '100vh',
  margin: '1rem',
  backgroundColor: 'background',
  gap: '1rem',
});

const profileCard = css({
  fontFamily: 'Noto Sans KR',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 'md',
  width: '16rem',
  height: '4rem',
  padding: '1rem',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
  gap: '1.5rem',
});

const profileInfo = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '0.5rem',
});

const profileImg = css({
  width: '2rem',
  height: '2rem',
  backgroundColor: 'gray',
  borderRadius: '50%',
});

const menuCard = css({
  fontFamily: 'Noto Sans KR',
  fontWeight: 'bold',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  fontSize: 'md',
  width: '16rem',
  height: 'auto',
  padding: '1rem 1.5rem',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
  gap: '1rem',
});

const menuButton = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'regular',
  fontSize: '1.2rem',
  gap: '0.5rem',
});

const finderCard = css({
  fontFamily: 'Noto Sans KR',
  fontWeight: 'regular',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fontSize: 'md',
  width: '16rem',
  height: '44rem',
  padding: '1rem 1rem',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
});

const finderButton = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'regular',
  fontSize: '1rem',
  gap: '0.5rem',
});

const Sidebar = () => {
  return (
    <div className={sideBar}>
      <div className={profileCard}>
        <div className={profileInfo}>
          <div className={profileImg} />
          기원님의 METRO
        </div>
        <SettingIcon color="black" />
      </div>
      <div className={menuCard}>
        <div className={menuButton}>
          <SearchIcon color="black" />
          Search
        </div>
        <div className={menuButton}>
          <HomeIcon color="black" />
          Home
        </div>
      </div>
      <div className={finderCard}>
        <div className={finderButton}>
          <PageOpenIcon color="black" />
          <div>👾</div>
          <div>file open</div>
        </div>
        <div className={finderButton}>
          <PageCloseIcon color="black" />
          <div>👾</div>
          <div>file close</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
