import { css } from '@/../styled-system/css';

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
});

const ProfileSection = () => {
  return (
    <div className={profileContainer}>
      <div className={profileImage} />
      <div className={profileName}>기원님의 Metro</div>
    </div>
  );
};

export default ProfileSection;
