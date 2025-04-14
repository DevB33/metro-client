import { css } from '@/../styled-system/css';

import HomeIcon from '@/icons/home-icon';
import { useRouter } from 'next/navigation';

const menuButton = css({
  height: '2rem',
  width: '100%',
  pl: 'tiny',
  display: 'flex',
  alignItems: 'center',
  gap: 'tiny',
  fontWeight: 'regular',
  fontSize: 'md',
  borderRadius: '5px',
  backgroundColor: { base: 'none', _hover: '#F1F1F0' },
  transition: '0.2s',
  cursor: 'pointer',
});

const HomeButton = () => {
  const router = useRouter();

  const goToHomepage = () => {
    router.push(`/`);
  };

  return (
    <div className={menuButton} onClick={goToHomepage}>
      <HomeIcon color="black" />
      Home
    </div>
  );
};

export default HomeButton;
