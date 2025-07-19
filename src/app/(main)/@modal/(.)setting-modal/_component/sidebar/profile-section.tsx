import Image from 'next/image';
import useSWR from 'swr';
import { css } from '@/../styled-system/css';
import SWR_KEYS from '@/constants/swr-keys';

const profileContainer = css({
  display: 'flex',
  flexDirection: 'row',
  height: '3.5rem',
  alignItems: 'center',
  px: 'small',
  gap: 'tiny',
  userSelect: 'none',
});

const profileImage = css({
  width: '2rem',
  height: '2rem',
  borderRadius: '50%',
  backgroundColor: 'black',
});

const profileName = css({
  fontSize: 'md',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const ProfileSection = () => {
  const { data: userInfo } = useSWR(SWR_KEYS.USER_INFO);

  return (
    <div className={profileContainer}>
      <Image src={userInfo?.avatar} alt="Profile Image" className={profileImage} width={32} height={32} />
      <div className={profileName}>{userInfo?.name}님의 Metro</div>
    </div>
  );
};

export default ProfileSection;
