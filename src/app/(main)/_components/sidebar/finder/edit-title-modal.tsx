import { css } from '@/../styled-system/css';
import { editIcon, editTitle, getNoteInfo } from '@/apis/note-header';
import { getPageList } from '@/apis/side-bar';
import IconSelector from '@/app/(main)/note/[id]/_components/note-header/icon-selector';
import keyName from '@/constants/key-name';
import useClickOutside from '@/hooks/useClickOutside';
import { useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

interface IEditTitleModal {
  noteId: string;
  closeEditModal: () => void;
}

const container = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

const modalContainer = css({
  position: 'absolute',
  width: '23.75rem',
  height: '2rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  boxShadow: 'dropDown',
  zIndex: '10000',
  borderRadius: 'lg',
  gap: 'tiny',
  px: '0.5rem',
});

const iconContainer = css({
  width: '1.8rem',
  height: '1.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  borderRadius: 'sm',
  borderWidth: '1px',
  borderColor: 'gray',
  cursor: 'pointer',
});

const inputContainer = css({
  flex: '1',
  height: '1.6rem',
  backgroundColor: 'lightGray',
  borderRadius: 'sm',
  borderWidth: '1px',
  borderColor: 'gray',
  px: '0.2rem',
  outline: 'none',
});

const IconSelectorContainer = css({
  position: 'absolute',
  top: '2.5rem',
  zIndex: '10001',
});

const EditTitleModal = ({ noteId, closeEditModal }: IEditTitleModal) => {
  const { data } = useSWR('noteInfo', () => getNoteInfo(noteId));
  const [value, setValue] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const editModalRef = useClickOutside(closeEditModal);

  const getNewTitle = async () => {
    const newTitle = await mutate('noteHeaderData', getNoteInfo(noteId), false);
    setValue(newTitle.title);
  };

  useEffect(() => {
    getNewTitle();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      await editTitle(noteId, value);
      await mutate('pageList', getPageList, false);
      await mutate('noteHeaderData', getNoteInfo(noteId), false);
      await mutate('noteInfo', getNoteInfo(noteId), false);
    }, 100);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, noteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelectIcon = async (selectedIcon: string | null) => {
    await editIcon(noteId, selectedIcon);
    await mutate('pageList', getPageList, false);
    await mutate('noteHeaderData', getNoteInfo(noteId));
    await mutate('noteInfo', getNoteInfo(noteId), false);
  };

  const handleSelectorOpen = () => {
    setIsSelectorOpen(true);
  };

  const handleSelectorClose = () => {
    setIsSelectorOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === keyName.enter) {
      event.preventDefault();
      closeEditModal();
    }
  };

  if (!data) return;
  return (
    <div ref={editModalRef} className={container}>
      <div className={modalContainer}>
        <div className={iconContainer} onClick={handleSelectorOpen}>
          {data.icon ?? ''}
        </div>
        <input value={value || ''} onChange={handleChange} onKeyDown={handleKeyDown} className={inputContainer} />
      </div>
      <div className={IconSelectorContainer}>
        <IconSelector
          handleSelectIcon={handleSelectIcon}
          handleSelectorClose={handleSelectorClose}
          isSelectorOpen={isSelectorOpen}
        />
      </div>
    </div>
  );
};

export default EditTitleModal;
