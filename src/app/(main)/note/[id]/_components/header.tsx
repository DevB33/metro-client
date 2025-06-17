'use client';

import { useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { css } from '@/../styled-system/css';

import LeftArrowIcon from '@/icons/left-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import DropDown from '@/components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import useSWR, { mutate } from 'swr';
import { deleteNote, getNoteList } from '@/apis/note';
import INotes from '@/types/note-type';

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
  const [dropdownMenuPosition, setDropdownMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: noteList } = useSWR('noteList');

  const openSettingDropdown = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect)
      setDropdownMenuPosition({
        x: rect.left - 140,
        y: rect.top + 30,
      });
    setIsDropdownOpen(true);
  };

  const closeSettingDropdown = () => {
    setIsDropdownOpen(false);
  };

  const sharenote = () => {
    router.push(`/note/share/${noteId}`);
  };

  const findParentId = (notes: INotes[], targetId: string, parentId: string | null = null): string | null => {
    const match = notes.find(note => {
      if (note.id === targetId) return true;

      if (note.children?.length) {
        const found = findParentId(note.children, targetId, note.id);
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
      await deleteNote(noteId);
      await mutate('noteList', getNoteList, false);
      const parentId = findParentId(noteList, noteId);
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
    const parentId = findParentId(noteList, noteId);
    if (parentId) {
      router.push(`/note/${parentId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={headerConatiner}>
      <div className={leftItemsConatiner}>
        <button type="button" className={backButton} onClick={handleBackButton}>
          <LeftArrowIcon />
        </button>
      </div>
      <div className={rightItemsConatiner}>
        <button type="button" className={shareButton} onClick={sharenote}>
          공유
        </button>
        <button type="button" className={dropDownButton} onClick={openSettingDropdown} ref={buttonRef}>
          <HorizonDotIcon />
          <DropDown handleClose={closeSettingDropdown}>
            <DropDown.Menu isOpen={isDropdownOpen} top={dropdownMenuPosition.y} left={dropdownMenuPosition.x}>
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
