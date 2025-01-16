import { css } from '@/../styled-system/css';

import SettingButton from './setting-button';

const profileCard = css({
  width: '16rem',
  height: '4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'small',
  gap: 'small',
  fontWeight: 'bold',
  fontSize: 'md',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
});

const profileInfo = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 'tiny',
});

const profileImg = css({
  width: '2rem',
  height: '2rem',
  backgroundColor: 'gray',
  borderRadius: '50%',
});

const ProfileCard = () => {
  const name = '기원';

  return (
    <div className={profileCard}>
      <div className={profileInfo}>
        <div className={profileImg} />
        {name}님의 METRO
      </div>
      <SettingButton />
    </div>
  );
};

export default ProfileCard;
