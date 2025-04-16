'use client';

import { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { css } from '@/../styled-system/css';

import PageCloseIcon from '@/icons/page-close-icon';
import PageOpenIcon from '@/icons/page-open-icon';
import PageIcon from '@/icons/page-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import PlusIcon from '@/icons/plus-icon';
import IDocuments from '@/types/document-type';
import { createPage, deletePage, getPageList } from '@/apis/side-bar';
import { mutate } from 'swr';
import TrashIcon from '@/icons/trash-icon';
import PencilSquareIcon from '@/icons/pencil-square';
import DropDown from '../../../../../components/dropdown/dropdown';
import EditTitleModal from './edit-title-modal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  const pathname = usePathname();

  const togglePage = () => {
    setIsOpen(!isOpen);
  };

  const openPage = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (
      toggleButtoonRef.current?.contains(event.target as Node) ||
      settingButtonRef.current?.contains(event.target as Node) ||
      plusButtonRef.current?.contains(event.target as Node)
    )
      return;

    router.push(`/note/${page.id}`);
  };

  const openSettingDropdown = () => {
    if (settingButtonRef.current) {
      const rect = settingButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top, // 버튼 아래에 위치
        left: rect.left + 30, // 적절히 조정
      });
    }
    setIsDropdownOpen(true);
  };

  const closeSettingDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleDeleteButtonClick = async () => {
    try {
      await deletePage(page.id);
      await mutate('pageList', getPageList, false);

      if (pathname === `/note/${page.id}`) {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
    closeSettingDropdown();
  };

  const handlePlusButtonClick = async () => {
    try {
      if (!isOpen) togglePage();
      await createPage(page.id);
      await mutate('pageList', getPageList, false);
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    closeSettingDropdown();
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
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
        <div className={pageTitle}>{page.title === null || page.title === '' ? '새 페이지' : page.title}</div>
        {isHover && (
          <div className={pageButtonContainer}>
            <button type="button" ref={settingButtonRef} className={pageButton} onClick={openSettingDropdown}>
              <HorizonDotIcon />
            </button>
            <button type="button" ref={plusButtonRef} className={pageButton} onClick={handlePlusButtonClick}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      <DropDown handleClose={closeSettingDropdown}>
        <DropDown.Menu isOpen={isDropdownOpen} top={dropdownPosition.top} left={dropdownPosition.left}>
          <DropDown.Item onClick={openEditModal}>
            <PencilSquareIcon />
            제목 수정하기
          </DropDown.Item>
          <DropDown.Item onClick={handleDeleteButtonClick}>
            <TrashIcon />
            삭제하기
          </DropDown.Item>
        </DropDown.Menu>
      </DropDown>
      {isEditModalOpen && <EditTitleModal noteId={page.id} closeEditModal={closeEditModal} />}
      {isOpen &&
        (page.children.length ? (
          <div className={pageChildren}>
            {page.children.map(child => (
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
