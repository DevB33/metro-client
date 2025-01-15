import { css } from '@/../styled-system/css';

import SearchIcon from '@/icons/search-icon';

const menuButton = css({
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: 'tiny',
  fontWeight: 'regular',
  fontSize: 'md',
});

const SearchButton = () => {
  return (
    <div className={menuButton}>
      <SearchIcon color="black" />
      Search
    </div>
  );
};

export default SearchButton;
