import { css } from '@/../styled-system/css';

import ISelectionPosition from '@/types/selection-position';
import { ITextBlock } from '@/types/block-type';
import BoldIcon from '@/icons/bold-icon';
import ItalicIcon from '@/icons/italic-icon';
import UnderlineIcon from '@/icons/underline-icon';
import LineThroughIcon from '@/icons/line-through-icon';
import CodeblockIcon from '@/icons/codeblock-icon';
import { JSX } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import IMenuState from '@/types/menu-type';
import changeSelectionStyle from './changeSelectionStyle';

interface ISelectionMenuProps {
  setKey: (key: number) => void;
  noteId: string;
  selection: ISelectionPosition;
  blockList: ITextBlock[];
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
  resetSelection: () => void;
  selectionMenuButtonRef: React.RefObject<(HTMLDivElement | null)[]>;
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

const SelectionMenu = ({
  setKey,
  noteId,
  selection,
  blockList,
  blockRef,
  menuState,
  setMenuState,
  resetSelection,
  selectionMenuButtonRef,
}: ISelectionMenuProps) => {
  const selectionMenuRef = useClickOutside(() => {
    setMenuState(prev => ({
      ...prev,
      isSelectionMenuOpen: false,
    }));
  });
  const menuHeight = 3;

  const changeBlock = (type: string) => {
    changeSelectionStyle(type, noteId, selection, blockList, blockRef);

    setMenuState(prev => ({
      ...prev,
      isSelectionMenuOpen: false,
    }));
    resetSelection();
    setKey(Math.random());
  };

  return (
    <div
      ref={selectionMenuRef}
      style={{
        top: `calc(${menuState.selectionMenuPosition.y}px - ${menuHeight}rem)`,
        left: menuState.selectionMenuPosition.x,
      }}
      className={menu}
    >
      {MENU_ITEMS.map((item, index) => (
        <div
          role="button"
          tabIndex={0}
          key={item.label}
          className={slashButton}
          onClick={() => changeBlock(item.label)}
          ref={el => {
            selectionMenuButtonRef.current[index] = el;
          }}
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

export default SelectionMenu;
