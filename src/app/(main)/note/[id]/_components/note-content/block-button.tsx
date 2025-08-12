import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { mutate } from 'swr';
import { css } from '@/../styled-system/css';

import { createBlock, deleteBlock, getBlockList, updateBlocksOrder } from '@/apis/client/block';
import { getNoteList } from '@/apis/client/note';
import { ITextBlock } from '@/types/block-type';
import IMenuState from '@/types/menu-type';
import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';
import TrashIcon from '@/icons/trash-icon';
import ArrowReapeatIcon from '@/icons/arrow-repeat-icon';
import SWR_KEYS from '@/constants/swr-keys';
import DropDown from '@/components/dropdown/dropdown';
import SlashMenu from './slash-menu/slash-menu';
import GhostBlock from './ghost-block/ghost-block';

interface IBlockButton {
  openBlockMenu: () => void;
  index: number;
  block: ITextBlock;
  setDragBlockIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  blockList: ITextBlock[];
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
}

const BlockButton = ({
  openBlockMenu,
  index,
  block,
  blockList,
  blockRef,
  setDragBlockIndex,
  setIsTyping,
  menuState,
  setMenuState,
}: IBlockButton) => {
  const params = useParams();
  const noteId = params.id as string;
  const buttonRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [isblockButtonModalOpen, setIsblockButtonModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [openedBySlashKey, setOpenedBySlashKey] = useState(true);

  const handleDragStart = async (event: React.DragEvent<HTMLButtonElement>) => {
    if (ghostRef.current) {
      setIsTyping(false);
      setDragBlockIndex(index);
      const ghost = ghostRef.current;

      event.dataTransfer.setDragImage(ghost, 10, 10);
    }
  };

  const deleteBlockByIndex = async () => {
    await deleteBlock(noteId, blockList[index].order, blockList[index].order);
    // 현재 블록 이후 블록 앞으로 한칸 씩 당기기
    // 현재 블록이 마지막 블록이 아닐 때만 당김
    if (index < blockList.length - 1) {
      await updateBlocksOrder(
        noteId,
        blockList[index + 1].order,
        blockList[blockList.length - 1].order,
        index === 0 ? -1 : blockList[index - 1].order,
      );
    }

    await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
    await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
  };

  const handleCreateBlockButton = async (blockIndex: number) => {
    if (index !== blockList.length - 1) {
      // 현재 블록 이후 블록 뒤로 한칸씩 미루기
      await updateBlocksOrder(
        noteId,
        blockList[index + 1].order,
        blockList[blockList.length - 1].order,
        blockList[index + 1].order,
      );
    }
    // 현재 블록 바로 뒤에 블록 생성
    await createBlock({
      noteId,
      type: 'DEFAULT',
      upperOrder: blockList[index].order,
      nodes: [{ content: '', type: 'text' }],
    });
    await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);

    setTimeout(() => {
      (blockRef.current[blockIndex + 1]?.parentNode as HTMLElement)?.focus();
    }, 0);
  };

  const handleClose = () => {
    if (menuState.blockButtonModalIndex !== index) return;
    setIsblockButtonModalOpen(false);
    setMenuState(prev => ({
      ...prev,
      blockButtonModalIndex: null,
      isBlockMenuOpen: false,
      slashMenuOpenIndex: null,
      isSlashMenuOpen: false,
    }));
  };

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.left - 140,
      });
    }
    setIsblockButtonModalOpen(true);
    setMenuState(prev => ({
      ...prev,
      blockButtonModalIndex: index,
    }));

    openBlockMenu();
  };

  const handleDelete = () => {
    deleteBlockByIndex();
    handleClose();
  };

  const handleChange = () => {
    if (buttonRef.current) {
      setOpenedBySlashKey(false);
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuState(prev => ({
        ...prev,
        slashMenuPosition: {
          x: rect.left + 20,
          y: rect.top,
        },
      }));
    }
    setMenuState(prev => ({
      ...prev,
      isSlashMenuOpen: true,
      slashMenuOpenIndex: index,
    }));
  };

  return (
    <div className={container} ref={buttonRef}>
      <GhostBlock ghostRef={ghostRef} block={block} blockList={blockList} index={index} />
      <button type="button" className={blockButton} onClick={() => handleCreateBlockButton(index)}>
        <PlusIcon />
      </button>
      <button type="button" className={blockButton} onClick={handleOpen} draggable onDragStart={handleDragStart}>
        <GripVerticalIcon />
      </button>
      {menuState.blockButtonModalIndex === index && (
        <DropDown handleClose={handleClose}>
          <DropDown.Menu isOpen={isblockButtonModalOpen} top={dropdownPosition.top} left={dropdownPosition.left}>
            {block.type !== 'PAGE' && (
              <DropDown.Item
                onClick={e => {
                  e.stopPropagation();
                  handleChange();
                }}
              >
                <ArrowReapeatIcon width="16px" height="16px" />
                전환
              </DropDown.Item>
            )}
            <DropDown.Item
              onClick={e => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <div className={deleteButton}>
                <TrashIcon />
                삭제하기
              </div>
            </DropDown.Item>
          </DropDown.Menu>
        </DropDown>
      )}
      {menuState.isSlashMenuOpen && menuState.slashMenuOpenIndex === index && (
        <SlashMenu
          index={index}
          blockList={blockList}
          blockRef={blockRef}
          menuState={menuState}
          setMenuState={setMenuState}
          openedBySlashKey={openedBySlashKey}
        />
      )}
    </div>
  );
};

const container = css({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'row',
});

const blockButton = css({
  width: '1.5em',
  height: '1.5rem',
  padding: '0.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#F1F1F0',
  },
});

const deleteButton = css({
  display: 'flex',
  flexDirection: 'row',
  color: 'red',
  gap: '0.25rem',
});

export default BlockButton;
