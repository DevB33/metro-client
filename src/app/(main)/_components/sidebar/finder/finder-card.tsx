import { css } from '@/../styled-system/css';

import { useState } from 'react';
import PlusIcon from '@/icons/plus-icon';
import IDocuments from '@/types/document-type';
import { createPage, getPageList } from '@/apis/side-bar';
import useSWR, { mutate } from 'swr';
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

const emptyPageContainer = css({
  px: 'tiny',
});

const FinderCard = () => {
  const [isHover, setIsHover] = useState(false);

  const { data } = useSWR(`pageList`);

  const handleClick = async () => {
    try {
      await createPage(null);
      await mutate('pageList', getPageList, false);
    } catch (error) {
      console.log(error);
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
            <button type="button" className={pageButton} onClick={handleClick}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      {data?.node.length ? (
        data.node.map((page: IDocuments) => <PageItem key={page.id} page={page} depth={1} />)
      ) : (
        <p className={emptyPageContainer}>문서가 없습니다.</p>
      )}
    </div>
  );
};

export default FinderCard;
