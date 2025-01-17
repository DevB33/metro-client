import { css } from '@/../styled-system/css';

import HomeIcon from '@/icons/home-icon';

const menuButton = css({
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: 'tiny',
  fontWeight: 'regular',
  fontSize: 'md',
});

const HomeButton = () => {
  return (
    <div className={menuButton}>
      <HomeIcon color="black" />
      Home
    </div>
  );
};

export default HomeButton;
