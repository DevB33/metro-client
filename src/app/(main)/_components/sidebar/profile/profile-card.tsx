import Image from 'next/image';
import useSWR from 'swr';
import { css } from '@/../styled-system/css';

import SWR_KEYS from '@/constants/swr-keys';
import SettingButton from './setting-button';

const ProfileCard = () => {
  const { data: userInfo } = useSWR(SWR_KEYS.USER_INFO);

  return (
    <div className={container}>
      <div className={profileContainer}>
        <Image
          src={userInfo?.avatar}
          alt={`${userInfo.name}의 프로필 이미지`}
          className={profileImg}
          width={32}
          height={32}
        />
        <div className={profileName}>{userInfo.name}님의 METRO</div>
      </div>
      <SettingButton />
    </div>
  );
};

const container = css({
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

const profileContainer = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 'tiny',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const profileImg = css({
  width: '2rem',
  height: '2rem',
  backgroundColor: 'gray',
  borderRadius: '50%',
});

const profileName = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export default ProfileCard;
