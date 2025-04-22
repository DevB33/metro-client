import { css } from '@/../styled-system/css';

import SearchButton from './search-button';
import HomeButton from './home-button';

const menuCard = css({
  width: '100%',
  height: 'auto',
  minHeight: '6.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: 'small',
  gap: 'tiny',
  fontWeight: 'bold',
  fontSize: 'md',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
  overflow: 'hidden',
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
