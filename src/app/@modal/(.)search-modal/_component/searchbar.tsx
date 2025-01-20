'useclient';

import { css } from '@/../styled-system/css';
import { useState } from 'react';

import SearchIcon from '@/icons/search-icon';
import CancleIcon from '@/icons/cancle-icon';

const searchBar = css({
  height: '3rem',
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
  transition: '0.2s',
});

const textInput = css({
  height: '2rem',
  width: '100%',
  pl: 'tiny',
  fontSize: 'md',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'black',
});

const cancleButton = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'tiny',
  cursor: 'pointer',
});

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const clearInput = () => {
    setInputValue('');
  };
  return (
    <div className={searchBar}>
      <SearchIcon color="black" />
      <input
        className={textInput}
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search Page or Keyword"
      />
      <div className={cancleButton} onClick={clearInput}>
        <CancleIcon color="black" />
      </div>
    </div>
  );
};

export default SearchBar;
