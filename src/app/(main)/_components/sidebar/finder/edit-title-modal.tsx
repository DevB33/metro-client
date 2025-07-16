import { css } from '@/../styled-system/css';
import { getNoteList, editNoteIcon, editNoteTitle, getNoteInfo } from '@/apis/note';
import IconSelector from '@/app/(main)/note/[id]/_components/note-header/icon-selector';
import keyName from '@/constants/key-name';
import useClickOutside from '@/hooks/useClickOutside';
import PageIcon from '@/icons/page-icon';
import INote from '@/types/note-type';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import useSWR, { mutate } from 'swr';

interface IEditTitleModal {
  noteId: string;
  closeEditModal: () => void;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

const container = css({
  position: 'absolute',
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

const EditTitleModal = ({ noteId, closeEditModal, top, left, right, bottom }: IEditTitleModal) => {
  const { data } = useSWR(`noteList`);

  const [value, setValue] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [noteNode, setNoteNode] = useState<INote | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const editModalRef = useClickOutside(closeEditModal);

  const findNode = (nodes: INote[], id: string): INote | null => {
    if (!nodes) return null;

    const directFoundNode = nodes.find(node => node.id === id);
    if (directFoundNode) return directFoundNode;

    let foundNode: INote | null = null;
    nodes.some(node => {
      if (node.children?.length) {
        foundNode = findNode(node.children, id);
      }
      return foundNode !== null;
    });

    return foundNode;
  };

  useEffect(() => {
    const foundNode = findNode(data.node, noteId);
    setNoteNode(foundNode);
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const foundNode = findNode(data.node, noteId);
    setNoteNode(foundNode);

    if (foundNode) {
      setValue(foundNode.title ?? '');
    }

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      await editNoteTitle(noteId, value);
      await mutate('noteList', getNoteList, false);
      await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId), false);
    }, 100);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, noteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelectIcon = async (selectedIcon: string | null) => {
    await editNoteIcon(noteId, selectedIcon);
    await mutate('noteList', getNoteList, false);
    await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId));
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

  return ReactDOM.createPortal(
    <div ref={editModalRef} className={container} style={{ top, left, right, bottom }}>
      <div className={modalContainer}>
        <div className={iconContainer} onClick={handleSelectorOpen}>
          {noteNode?.icon ?? <PageIcon color="#949491" />}
        </div>
        <input
          ref={inputRef}
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={inputContainer}
        />
      </div>
      <div className={IconSelectorContainer}>
        <IconSelector
          handleSelectIcon={handleSelectIcon}
          handleSelectorClose={handleSelectorClose}
          isSelectorOpen={isSelectorOpen}
        />
      </div>
    </div>,
    document.body,
  );
};

export default EditTitleModal;
