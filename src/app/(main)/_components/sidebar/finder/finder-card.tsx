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

const pageContainer = css({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
});

const FinderCard = () => {
  const [isHover, setIsHover] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const { data: pageList } = useSWR('pageList');

  const handleClick = async () => {
    try {
      await createPage(null);
      await mutate('pageList', getPageList, false);
    } catch (error) {
      console.log(error);
    }
  };

  const contextOpenSettingDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('우클릭');
    event.preventDefault();
    console.log(event.clientX, event.clientY);
    setDropdownPosition({
      top: event.clientY, // 버튼 아래에 위치
      left: event.clientX, // 적절히 조정
    });
    setIsDropdownOpen(true);
  };

  return (
    <div className={finderCard}>
      <div className={pageItem} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        기원 님의 workspace
        {isHover && (
          <div className={pageButtonContainer}>
            <button type="button" className={pageButton} onClick={handleClick}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      <div className={pageContainer}>
        {pageList?.node.length ? (
          pageList.node.map((page: IDocuments) => (
            <PageItem
              key={page.id}
              page={page}
              depth={1}
              isDropdownOpen={isDropdownOpen}
              dropdownPosition={dropdownPosition}
              setIsDropdownOpen={setIsDropdownOpen}
              setDropdownPosition={setDropdownPosition}
              contextOpenSettingDropdown={contextOpenSettingDropdown}
            />
          ))
        ) : (
          <p className={emptyPageContainer}>문서가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FinderCard;
