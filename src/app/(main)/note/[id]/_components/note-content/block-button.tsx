import { css } from '@/../styled-system/css';

import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';
import DropDown from '@/components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import ArrowReapeatIcon from '@/icons/arrow-repeat-icon';
import { useEffect, useRef, useState } from 'react';
import { ITextBlock } from '@/types/block-type';
import SlashMenu from './block/slash-menu';

interface IBlockButton {
  OpenBlockMenu: () => void;
  CloseBlockMenu: () => void;
  deleteBlockByIndex: (indexToDelete: number) => void;
  index: number;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
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
  deleteBlockByIndex,
  index,
  blockList,
  setBlockList,
  blockRef,
}: IBlockButton) => {
  const [isblockButtonModalOpen, setIsblockButtonModalOpen] = useState(false);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

  const buttonRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

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
    deleteBlockByIndex(index);
    handleClose();
  };

  const handleChange = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setSlashMenuPosition({
        x: rect.left + 20,
        y: rect.top,
      });
    }

    setIsSlashMenuOpen(true);
  };

  return (
    <div className={blockBtnContainer} ref={buttonRef}>
      <div>
        <PlusIcon />
      </div>
      <div className={blockBtn} onMouseUp={handleOpen}>
        <GripVerticalIcon />
      </div>
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
      {isSlashMenuOpen && (
        <SlashMenu
          position={slashMenuPosition}
          index={index}
          blockList={blockList}
          blockRef={blockRef}
          setBlockList={setBlockList}
          isSlashMenuOpen={isSlashMenuOpen}
          setIsSlashMenuOpen={setIsSlashMenuOpen}
        />
      )}
    </div>
  );
};

export default BlockButton;
