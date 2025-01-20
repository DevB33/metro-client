'useclient';

import { css } from '@/../styled-system/css';

import SearchIcon from '@/icons/search-icon';

const searchBar = css({
  height: '4rem',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  px: 'small',
  gap: 'tiny',
  fontWeight: 'regular',
  fontSize: 'md',
  cursor: 'text',
  backgroundColor: { base: '#F1F1F0', _hover: 'lightgray' },
});

const textInput = css({
  height: '2rem',
  width: '100%',
  pl: 'tiny',
  fontSize: 'md',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'black',
});

const SearchBar = () => {
  return (
    <div className={searchBar}>
      <SearchIcon color="black" />
      <input className={textInput} type="text" placeholder="Search Page or Keyword" />
    </div>
  );
};

export default SearchBar;
