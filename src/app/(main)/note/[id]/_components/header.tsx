'use client';

import { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { css } from '@/../styled-system/css';

import LeftArrowIcon from '@/icons/left-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import DropDown from '@/components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import useSWR, { mutate } from 'swr';
import { deleteNote, getNoteList } from '@/apis/note';
import IPageType from '@/types/page-type';

const headerConatiner = css({
  boxSizing: 'border-box',
  width: '100%',
  paddingTop: 'small',
  px: 'small',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  userSelect: 'none',
});

const leftItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const rightItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const shareButton = css({
  cursor: 'pointer',
});

const dropDownButton = css({
  cursor: 'pointer',
});

const backButton = css({
  cursor: 'pointer',
});

const Header = () => {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const pageId = pathname.split('note/')[1];

  const { data: pageList } = useSWR('pageList');

  const openSettingDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeSettingDropdown = () => {
    setIsDropdownOpen(false);
  };

  const sharePage = () => {
    router.push(`/note/share/${noteId}`);
  };

  const findParentId = (nodeList: IPageType[], targetId: string, parentId: string | null = null): string | null => {
    const match = nodeList.find(node => {
      if (node.id === targetId) return true;

      if (node.children?.length) {
        const found = findParentId(node.children, targetId, node.id);
        if (found) {
          parentId = found;
          return true;
        }
      }

      return false;
    });

    return match ? parentId : null;
  };

  const handleDeleteButtonClick = async () => {
    try {
      await deleteNote(pageId);
      await mutate('pageList', getNoteList, false);
      const parentId = findParentId(pageList.node, pageId);
      if (parentId) {
        router.push(`/note/${parentId}`);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
    closeSettingDropdown();
  };

  const handleBackButton = () => {
    const parentId = findParentId(pageList.node, pageId);
    if (parentId) {
      router.push(`/note/${parentId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={headerConatiner}>
      <div className={leftItemsConatiner}>
        <button className={backButton} onClick={handleBackButton}>
          <LeftArrowIcon />
        </button>
      </div>
      <div className={rightItemsConatiner}>
        <button type="button" className={shareButton} onClick={sharePage}>
          공유
        </button>
        <button type="button" className={dropDownButton} onClick={openSettingDropdown}>
          <HorizonDotIcon />
          <DropDown handleClose={closeSettingDropdown}>
            <DropDown.Menu isOpen={isDropdownOpen}>
              <DropDown.Item onClick={handleDeleteButtonClick}>
                <TrashIcon />
                삭제하기
              </DropDown.Item>
            </DropDown.Menu>
          </DropDown>
        </button>
      </div>
    </div>
  );
};

export default Header;
