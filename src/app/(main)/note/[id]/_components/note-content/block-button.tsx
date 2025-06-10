import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { css } from '@/../styled-system/css';
import { mutate } from 'swr';

import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';
import DropDown from '@/components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import ArrowReapeatIcon from '@/icons/arrow-repeat-icon';
import { ITextBlock } from '@/types/block-type';
import IMenuState from '@/types/menu-type';
import { createBlock, deleteBlock, getBlockList, updateBlocksOrder } from '@/apis/block';
import SlashMenu from './slash-menu/slash-menu';
import GhostBlock from './ghost-block/ghost-block';

interface IBlockButton {
  OpenBlockMenu: () => void;
  CloseBlockMenu: () => void;
  index: number;
  block: ITextBlock;
  setDragBlockIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  blockList: ITextBlock[];
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
}

const blockBtnContainer = css({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'row',
});

const blockBtn = css({
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

const deleteBtn = css({
  display: 'flex',
  flexDirection: 'row',
  color: 'red',
  gap: '0.25rem',
});

const BlockButton = ({
  OpenBlockMenu,
  CloseBlockMenu,
  index,
  block,
  blockList,
  blockRef,
  setDragBlockIndex,
  setIsTyping,
  menuState,
  setMenuState,
}: IBlockButton) => {
  const [isblockButtonModalOpen, setIsblockButtonModalOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [openedBySlashKey, setOpenedBySlashKey] = useState(true);

  const ghostRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const noteId = params.id as string;

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

    await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
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
    await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

    setTimeout(() => {
      (blockRef.current[blockIndex + 1]?.parentNode as HTMLElement)?.focus();
    }, 0);
  };

  const handleClose = () => {
    setIsblockButtonModalOpen(false);
    CloseBlockMenu();
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
    OpenBlockMenu();
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
    <div className={blockBtnContainer} ref={buttonRef}>
      <GhostBlock ghostRef={ghostRef} block={block} blockList={blockList} index={index} />
      <button type="button" className={blockBtn} onClick={() => handleCreateBlockButton(index)}>
        <PlusIcon />
      </button>
      <button type="button" className={blockBtn} onClick={handleOpen} draggable onDragStart={handleDragStart}>
        <GripVerticalIcon />
      </button>
      <DropDown handleClose={handleClose}>
        <DropDown.Menu isOpen={isblockButtonModalOpen} top={dropdownPosition.top} left={dropdownPosition.left}>
          <DropDown.Item onClick={handleChange}>
            <ArrowReapeatIcon width="16px" height="16px" />
            전환
          </DropDown.Item>
          <DropDown.Item onClick={handleDelete}>
            <div className={deleteBtn}>
              <TrashIcon />
              삭제하기
            </div>
          </DropDown.Item>
        </DropDown.Menu>
      </DropDown>
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

export default BlockButton;
