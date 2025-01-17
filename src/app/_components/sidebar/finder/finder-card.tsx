import { css } from '@/../styled-system/css';

import { useEffect, useState } from 'react';
import IPageType from '@/types/page-type';
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

const FinderCard = () => {
  const [mockPageList, setMockPageList] = useState<IPageType[]>();

  useEffect(() => {
    const storedPageList = localStorage.getItem('pageList');
    if (storedPageList) {
      setMockPageList(JSON.parse(storedPageList));
    } else {
      localStorage.setItem('pageList', JSON.stringify(pageList));
      setMockPageList(pageList);
    }
  }, []);

  return (
    <div className={finderCard}>
      {mockPageList?.map(page => {
        return <PageItem key={page.pageId} page={page} depth={1} />;
      })}
    </div>
  );
};

export default FinderCard;
