import { css } from '@/../styled-system/css';

import SearchButton from './search-button';
import HomeButton from './home-button';

const menuCard = css({
  width: '16rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '1rem 1.5rem',
  gap: 'tiny',
  fontWeight: 'bold',
  fontSize: 'md',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
});

const SideMenuCard = () => {
  return (
    <div className={menuCard}>
      <SearchButton />
      <HomeButton />
    </div>
  );
};

export default SideMenuCard;
