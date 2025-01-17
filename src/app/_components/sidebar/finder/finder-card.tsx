import { css } from '@/../styled-system/css';

import { useEffect, useState } from 'react';
import IPageType from '@/types/page-type';
import PlusIcon from '@/icons/plus-icon';
import PageItem from './page-item';
import pageList from './page-list-mock';

const finderCard = css({
  width: '100%',
  height: '44rem',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: 'small',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
});

const pageItem = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: '2rem',
  px: 'tiny',
  gap: '0.25rem',
  fontWeight: 'regular',
  fontSize: 'md',
  borderRadius: '0.25rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#F1F1F0',
  },
});

const pageButtonContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const pageButton = css({
  borderRadius: '0.25rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#E4E4E3',
  },
});

const FinderCard = () => {
  const [mockPageList, setMockPageList] = useState<IPageType[]>();
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const storedPageList = localStorage.getItem('pageList');
    if (storedPageList) {
      setMockPageList(JSON.parse(storedPageList));
    } else {
      localStorage.setItem('pageList', JSON.stringify(pageList));
      setMockPageList(pageList);
    }
  }, []);

  const createPage = () => {
    const newPage: IPageType = {
      pageId: Date.now(),
      title: '새 페이지',
      icon: '',
      children: [],
    };
    const updatedPageList = [...(mockPageList || []), newPage];

    localStorage.setItem('pageList', JSON.stringify(updatedPageList));
    setMockPageList(updatedPageList);
  };

  return (
    <div className={finderCard}>
      <div
        className={pageItem}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        기원 님의 workspace
        {isHover && (
          <div className={pageButtonContainer}>
            <button type="button" className={pageButton} onClick={createPage}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      {mockPageList?.map(page => {
        return <PageItem key={page.pageId} page={page} depth={1} />;
      })}
    </div>
  );
};

export default FinderCard;
