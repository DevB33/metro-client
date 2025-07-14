import Image from 'next/image';
import useSWR from 'swr';
import { css } from '@/../styled-system/css';

import SettingButton from './setting-button';

const profileCard = css({
  width: '100%',
  height: '4rem',
  minHeight: '4rem',
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
  overflow: 'hidden',
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
  const { data: userInfo } = useSWR(`userInfo`);

  return (
    <div className={profileCard}>
      <div className={profileInfo}>
        <Image
          src={userInfo?.avatar}
          alt={`${userInfo.name}의 프로필 이미지`}
          className={profileImg}
          width={32}
          height={32}
        />
        {userInfo.name}님의 METRO
      </div>
      <SettingButton />
    </div>
  );
};

export default ProfileCard;
