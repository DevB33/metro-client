'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@/../styled-system/css';

import PageCloseIcon from '@/icons/page-close-icon';
import PageOpenIcon from '@/icons/page-open-icon';
import PageIcon from '@/icons/page-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import PlusIcon from '@/icons/plus-icon';
import IDocuments from '@/types/document-type';
import useSWR from 'swr';

const pageItemContainer = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const pageItem = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: '2rem',
  pr: 'tiny',
  gap: '0.25rem',
  fontWeight: 'regular',
  fontSize: 'md',
  borderRadius: '0.25rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#F1F1F0',
  },
});

const pageButton = css({
  borderRadius: '0.25rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#E4E4E3',
  },
});

const pageButtonContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.75rem',
});

const pageIcon = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  height: '1.5rem',
  minWidth: '1.5rem',
  minHeight: '1.5rem',
});

const pageTitle = css({
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const pageChildren = css({
  display: 'flex',
  flexDirection: 'column',
});

const noChildren = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '2rem',
  pl: 'large',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const PageItem = ({ page, depth }: { page: IDocuments; depth: number }) => {
  const router = useRouter();
  const toggleButtoonRef = useRef<HTMLButtonElement>(null);
  const settingButtonRef = useRef<HTMLButtonElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [currentPage, setCurrentPage] = useState<IDocuments>(page);

  const togglePage = () => {
    setIsOpen(!isOpen);
  };

  const openPage = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      toggleButtoonRef.current?.contains(event.target as Node) ||
      settingButtonRef.current?.contains(event.target as Node) ||
      plusButtonRef.current?.contains(event.target as Node)
    )
      return;

    router.push(`/note/${page.id}`);
  };

  const openSettingDropdown = () => {
    // TODD: 페이지 설정 드롭다운 열기
  };

  const deletePage = async () => {
    console.log(currentPage);
    try {
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId: currentPage.id }),
      });

      if (response.ok) {
        setCurrentPage(prevPage => {
          if (!prevPage) return prevPage;

          const updatedChildren = prevPage.children.filter(child => child.id !== currentPage.id);

          return {
            ...prevPage,
            children: updatedChildren,
          };
        });
      } else {
        throw new Error('Failed to delete child page');
      }
    } catch (error) {
      console.error('Error creating delete page:', error);
    }
  };

  const createChildPage = async () => {
    togglePage();
    try {
      // 부모 페이지가 있을 경우에만 자식 페이지 생성
      if (!currentPage) return;

      // API로 새 페이지 생성 요청
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId: currentPage.id }),
      });

      if (response.ok) {
        const data = await response.json();

        const newChildPage: IDocuments = {
          id: data.id,
          title: '새 페이지',
          icon: '',
          children: [],
        };

        setCurrentPage(prevPage => {
          if (!prevPage) return prevPage;
          return {
            ...prevPage,
            children: [...prevPage.children, newChildPage],
          };
        });
      } else {
        throw new Error('Failed to create child page');
      }
    } catch (error) {
      console.error('Error creating child page:', error);
    }
  };

  return (
    <div className={pageItemContainer}>
      <div
        className={pageItem}
        style={{ paddingLeft: `${depth * 0.5}rem` }}
        onClick={openPage}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onKeyDown={openPage}
        role="button"
        tabIndex={0}
      >
        <button type="button" ref={toggleButtoonRef} className={pageButton} onClick={togglePage}>
          {isOpen ? <PageOpenIcon color="black" /> : <PageCloseIcon color="black" />}
        </button>
        <div className={pageIcon}>{page.icon ? `${page.icon}` : <PageIcon />}</div>
        <div className={pageTitle}>{page.title === null ? '새 페이지' : page.title}</div>
        {isHover && (
          <div className={pageButtonContainer}>
            <button
              type="button"
              ref={settingButtonRef}
              className={pageButton}
              onClick={deletePage}
            >
              <HorizonDotIcon />
            </button>
            <button
              type="button"
              ref={plusButtonRef}
              className={pageButton}
              onClick={createChildPage}
            >
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      {isOpen &&
        (currentPage.children.length ? (
          <div className={pageChildren}>
            {currentPage.children.map(child => (
              <PageItem key={child.id} page={child} depth={depth + 1} />
            ))}
          </div>
        ) : (
          <div className={noChildren}>하위 페이지 없음</div>
        ))}
    </div>
  );
};

export default PageItem;
