'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@/../styled-system/css';

import PageCloseIcon from '@/icons/page-close-icon';
import PageOpenIcon from '@/icons/page-open-icon';
import PageIcon from '@/icons/page-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import PlusIcon from '@/icons/plus-icon';
import INotes from '@/types/note-type';
import { createNote, deleteNote, getNoteList } from '@/apis/note';
import useSWR, { mutate } from 'swr';
import TrashIcon from '@/icons/trash-icon';
import PencilSquareIcon from '@/icons/pencil-square';
import { toast } from 'react-toastify';
import { toastErrorMessage, toastSuccessMessage } from '@/constants/toast-message';
import DropDown from '../../../../../components/dropdown/dropdown';
import EditTitleModal from './edit-title-modal';

interface INoteItem {
  note: INotes;
  depth: number;
  openedDropdownnoteId: string | null;
  setOpenedDropdownnoteId: React.Dispatch<React.SetStateAction<string | null>>;
}

const noteItemContainer = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const noteItem = css({
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

const noteButton = css({
  borderRadius: '0.25rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#E4E4E3',
  },
});

const noteButtonContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.75rem',
});

const noteIcon = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  height: '1.5rem',
  minWidth: '1.5rem',
  minHeight: '1.5rem',
});

const noteTitle = css({
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const noteChildren = css({
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

const NoteItem = ({ note, depth, openedDropdownnoteId, setOpenedDropdownnoteId }: INoteItem) => {
  const router = useRouter();
  const noteItemRef = useRef<HTMLDivElement>(null);
  const toggleButtoonRef = useRef<HTMLButtonElement>(null);
  const settingButtonRef = useRef<HTMLButtonElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [editTitleModalPosition, seteditTitleModalPosition] = useState({ top: 0, left: 0 });

  const { data: noteList } = useSWR('noteList');

  const togglenote = () => {
    setIsOpen(!isOpen);
  };

  const opennote = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (
      toggleButtoonRef.current?.contains(event.target as Node) ||
      settingButtonRef.current?.contains(event.target as Node) ||
      plusButtonRef.current?.contains(event.target as Node)
    )
      return;

    router.push(`/note/${note.id}`);
  };

  const openSettingDropdown = () => {
    if (settingButtonRef.current) {
      const rect = settingButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.left + 30,
      });
    }
    setOpenedDropdownnoteId(note.id);
  };

  const closeSettingDropdown = () => {
    setOpenedDropdownnoteId(null);
  };

  const findParentId = (notes: INotes[], targetId: string, parentId: string | null = null): string | null => {
    const match = notes.find(item => {
      if (item.id === targetId) return true;

      if (item.children?.length) {
        const found = findParentId(item.children, targetId, item.id);
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
      await deleteNote(note.id);
      await mutate('noteList', getNoteList, false);
      const parentId = findParentId(noteList, note.id);

      if (parentId) {
        router.push(`/note/${parentId}`);
      } else {
        router.push('/');
      }
      toast.success(toastSuccessMessage.NoteDelete);
    } catch (error) {
      toast.error(toastErrorMessage.NoteDelete);
    }
    closeSettingDropdown();
  };

  const handlePlusButtonClick = async () => {
    try {
      if (!isOpen) togglenote();
      const noteId = await createNote(note.id);
      await mutate('noteList', getNoteList, false);
      router.push(`/note/${noteId}`);
      toast.success(toastSuccessMessage.NoteCreate);
    } catch (error) {
      toast.error(toastErrorMessage.NoteCreate);
    }
  };

  const openEditModal = () => {
    if (noteItemRef.current) {
      const rect = noteItemRef.current.getBoundingClientRect();
      seteditTitleModalPosition({
        left: rect.left,
        top: rect.top + 30,
      });
    }

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const contextOpenSettingDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDropdownPosition({
      top: event.clientY,
      left: event.clientX,
    });
    setOpenedDropdownnoteId(note.id);
  };

  return (
    <div className={noteItemContainer}>
      <div
        className={noteItem}
        ref={noteItemRef}
        style={{ paddingLeft: `${depth * 0.5}rem` }}
        onClick={opennote}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onKeyDown={opennote}
        role="button"
        tabIndex={0}
        onContextMenu={contextOpenSettingDropdown}
      >
        <button type="button" ref={toggleButtoonRef} className={noteButton} onClick={togglenote}>
          {isOpen ? <PageOpenIcon color="black" /> : <PageCloseIcon color="black" />}
        </button>
        <div className={noteIcon}>{note.icon ? `${note.icon}` : <PageIcon />}</div>
        <div className={noteTitle}>{note.title === null || note.title === '' ? '새 페이지' : note.title}</div>
        {isHover && (
          <div className={noteButtonContainer}>
            <button type="button" ref={settingButtonRef} className={noteButton} onClick={openSettingDropdown}>
              <HorizonDotIcon />
            </button>
            <button type="button" ref={plusButtonRef} className={noteButton} onClick={handlePlusButtonClick}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      <DropDown handleClose={closeSettingDropdown}>
        <DropDown.Menu
          isOpen={openedDropdownnoteId === note.id}
          top={dropdownPosition.top}
          left={dropdownPosition.left}
        >
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
      {isEditModalOpen && (
        <EditTitleModal
          noteId={note.id}
          closeEditModal={closeEditModal}
          left={editTitleModalPosition.left}
          top={editTitleModalPosition.top}
        />
      )}
      {isOpen &&
        (note.children.length ? (
          <div className={noteChildren}>
            {note.children.map(child => (
              <NoteItem
                key={child.id}
                note={child}
                depth={depth + 1}
                openedDropdownnoteId={openedDropdownnoteId}
                setOpenedDropdownnoteId={setOpenedDropdownnoteId}
              />
            ))}
          </div>
        ) : (
          <div className={noChildren}>하위 페이지 없음</div>
        ))}
    </div>
  );
};

export default NoteItem;
