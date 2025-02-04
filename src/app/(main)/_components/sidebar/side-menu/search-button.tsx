import { css } from '@/../styled-system/css';
import { useRouter } from 'next/navigation';

import SearchIcon from '@/icons/search-icon';

const menuButton = css({
  height: '2rem',
  width: '100%',
  pl: 'tiny',
  display: 'flex',
  alignItems: 'center',
  gap: 'tiny',
  fontWeight: 'regular',
  fontSize: 'md',
  cursor: 'pointer',
  borderRadius: '5px',
  backgroundColor: { base: 'none', _hover: '#F1F1F0' },
  transition: '0.2s',
});

const SearchButton = () => {
  const router = useRouter();

  const openSearch = () => {
    router.push('/search-modal');
  };
  return (
    <div className={menuButton} onClick={openSearch}>
      <SearchIcon color="black" />
      Search
    </div>
  );
};

export default SearchButton;
