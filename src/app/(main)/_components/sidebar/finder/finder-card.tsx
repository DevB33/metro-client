import { css } from '@/../styled-system/css';

import { useEffect, useState } from 'react';
import PlusIcon from '@/icons/plus-icon';
import IDocuments from '@/types/document-type';
import PageItem from './page-item';

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

const FinderCard = ({ list }: { list: IDocuments[] }) => {
  const [pageList, setPageList] = useState<IDocuments[]>();
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    console.log(list);
    setPageList(list);
  }, [list]);

  const rootCreatePage = async () => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId: null }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Document created with ID:', data.id);
      } else {
        console.log(response);
        throw new Error('Failed to create document');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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
            <button type="button" className={pageButton} onClick={rootCreatePage}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      {pageList?.length ? (
        pageList.map(page => <PageItem key={page.id} page={page} depth={1} />)
      ) : (
        <p>문서가 없습니다.</p> // 데이터가 없을 때 메시지 추가
      )}
    </div>
  );
};

export default FinderCard;
