import { css } from '@/../styled-system/css';

import IPageType from '@/types/page-type';
import PageIcon from '@/icons/page-icon';

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
  backgroundColor: { base: 'none', _hover: '#F1F1F0' },
  borderRadius: '5px',
  transition: '0.2s',
});

const pageIcon = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  height: '1.5rem',
});

const pageTitle = css({
  width: '10rem',
  fontWeight: 'medium',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const pagePath = css({
  fontSize: 'md',
  color: 'gray',
});

const SearchBar = ({ page }: { page: IPageType }) => {
  return (
    <div className={searchBar}>
      <div className={pageIcon}>{page.icon ? `${page.icon}` : <PageIcon />}</div>
      <div className={pageTitle}>{page.title}</div>
      <div className={pagePath}>page/경로/page</div>
    </div>
  );
};

export default SearchBar;
