import { css } from '@/../styled-system/css';
import { useRouter } from 'next/navigation';

import HomeIcon from '@/icons/home-icon';

const HomeButton = () => {
  const router = useRouter();

  const goToHomepage = () => {
    router.push(`/`);
  };

  return (
    <button type="button" className={menuButton} onClick={goToHomepage}>
      <HomeIcon color="black" />
      Home
    </button>
  );
};

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

export default HomeButton;
