'use client';

import { css } from '@/../styled-system/css';
import { useRouter } from 'next/navigation';

import SearchBar from './_component/searchbar';
import SearchResult from './_component/searchResult';
import searchResultList from './search-list-mock';

const overlayStyles = css({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // 어둡게 처리
  zIndex: 999,
});

const searchModalContainer = css({
  width: '52rem',
  height: '32rem',
  position: 'absolute',
  top: '50%',
  left: ' 50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '1rem',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'settingModal',
  backgroundColor: 'white',
  overflow: 'hidden',
  zIndex: 1000,
});

const searchResultContainer = css({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  pt: '0.5rem',
  px: '1rem',
  overflow: 'hidden',
});

const searchListContainer = css({
  flex: '1',
  overflow: 'auto',
  py: '0.3rem',
});

const resultTitle = css({
  pl: 'tiny',
  fontSize: '1rem',
  height: '2rem',
  fontWeight: 'bold',
  color: 'gray',
});

const noResult = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  fontSize: 'md',
  color: 'gray',
});

const divider = css({
  backgroundColor: 'lightgray',
  height: '1px',
  borderRadius: '1rem',
});

const SearchModal = () => {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  return (
    <>
      <div className={overlayStyles} onClick={closeModal} />
      <div className={searchModalContainer}>
        <SearchBar />
        <div className={searchResultContainer}>
          <div className={resultTitle}>검색 결과</div>
          <div className={divider}></div>
          <div className={searchListContainer}>
            {searchResultList.length > 0 ? (
              searchResultList.map(page => <SearchResult key={page.pageId} page={page} />)
            ) : (
              <div className={noResult}>결과가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
