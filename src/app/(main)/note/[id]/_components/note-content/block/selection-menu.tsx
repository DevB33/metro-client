import { css } from '@/../styled-system/css';

import ISelectionPosition from '@/types/selection-position';
import { ITextBlock } from '@/types/block-type';
import BoldIcon from '@/icons/bold-icon';
import ItalicIcon from '@/icons/italic-icon';
import UnderlineIcon from '@/icons/underline-icon';
import LineThroughIcon from '@/icons/line-through-icon';
import CodeblockIcon from '@/icons/codeblock-icon';
import { JSX } from 'react';
import selectionChange from './selectionChange';

interface ISelectionMenuProps {
  position: { x: number; y: number };
  setKey: (key: number) => void;
  selectionStartPosition: ISelectionPosition;
  selectionEndPosition: ISelectionPosition;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  setIsSelectionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetSelection: () => void;
}

const menu = css({
  position: 'fixed',
  width: 'auto',
  height: 'auto',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  background: 'white',
  border: '1px solid lightgray',
  borderRadius: '.3rem',
  boxShadow: 'dropDown',
  fontSize: 'md',
  padding: '.3rem',
  zIndex: 1000,
  pointerEvents: 'auto',
});

const slashButton = css({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '.3rem',
  cursor: 'pointer',
  backgroundColor: { base: 'none', _hover: 'lightgray' },
});

const MENU_ITEMS: {
  label: string;
  icon: JSX.Element;
}[] = [
  { label: 'bold', icon: <BoldIcon color="black" /> },
  { label: 'italic', icon: <ItalicIcon color="black" /> },
  { label: 'underline', icon: <UnderlineIcon color="black" /> },
  { label: 'line-through', icon: <LineThroughIcon color="black" /> },
  { label: 'codeblock', icon: <CodeblockIcon color="black" /> },
];

const selectionMenu = ({
  position,
  setKey,
  selectionStartPosition,
  selectionEndPosition,
  blockList,
  setBlockList,
  blockRef,
  setIsSelectionMenuOpen,
  resetSelection,
}: ISelectionMenuProps) => {
  const menuHeight = 3;

  const changeBlock = (type: string) => {
    selectionChange(type, selectionStartPosition, selectionEndPosition, blockList, setBlockList, blockRef);
    setIsSelectionMenuOpen(false);
    resetSelection();
    setKey(Math.random());
  };

  return (
    <div style={{ top: `calc(${position.y}px - ${menuHeight}rem)`, left: position.x }} className={menu}>
      {MENU_ITEMS.map(item => (
        <div
          role="button"
          tabIndex={0}
          key={item.label}
          className={slashButton}
          onClick={() => changeBlock(item.label)}
          onKeyDown={event => {
            if (event.key === 'Enter') changeBlock(item.label);
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default selectionMenu;
