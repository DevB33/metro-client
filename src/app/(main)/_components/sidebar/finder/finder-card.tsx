import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { css } from '@/../styled-system/css';

import { useState } from 'react';
import PlusIcon from '@/icons/plus-icon';
import INotes from '@/types/note-type';
import { createNote, getNoteList } from '@/apis/note';
import { TOAST_ERRORMESSAGE, TOAST_SUCCESSMESSAGE } from '@/constants/toast-message';
import NoteItem from './note-item';

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

const noteTitle = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const noteItem = css({
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

const noteButtonContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const noteButton = css({
  borderRadius: '0.25rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#E4E4E3',
  },
});

const emptynoteContainer = css({
  px: 'tiny',
});

const noteContainer = css({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
});

const FinderCard = () => {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const [openedDropdownnoteId, setOpenedDropdownnoteId] = useState<string | null>(null);
  const [draggingNoteInfo, setDraggingNoteInfo] = useState<{
    noteId: string;
    parentId: string;
    order: number;
  } | null>(null);
  const [isDragFirst, setIsDragFirst] = useState(false);
  const { data: noteList } = useSWR('noteList');
  const { data: userInfo } = useSWR(`userInfo`);

  const handleClick = async () => {
    try {
      const noteId = await createNote(null);
      await mutate('noteList', getNoteList, false);
      router.push(`/note/${noteId}`);
      toast.success(TOAST_SUCCESSMESSAGE.NoteCreate);
    } catch (error) {
      toast.error(TOAST_ERRORMESSAGE.NoteCreate);
    }
  };

  return (
    <div className={finderCard}>
      <div className={noteItem} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <div className={noteTitle}>{userInfo?.name} 님의 workspace</div>
        {isHover && (
          <div className={noteButtonContainer}>
            <button type="button" className={noteButton} onClick={handleClick}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      <div className={noteContainer}>
        {noteList?.length ? (
          noteList.map((note: INotes, index: number) => (
            <NoteItem
              key={note.id}
              note={note}
              depth={1}
              openedDropdownnoteId={openedDropdownnoteId}
              setOpenedDropdownnoteId={setOpenedDropdownnoteId}
              draggingNoteInfo={draggingNoteInfo}
              setDraggingNoteInfo={setDraggingNoteInfo}
              isDragFirst={isDragFirst}
              setIsDragFirst={setIsDragFirst}
              index={index}
            />
          ))
        ) : (
          <p className={emptynoteContainer}>문서가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FinderCard;
