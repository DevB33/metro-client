import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import { SELECTION_MENU_ITEMS } from '@/constants/menu-items';
import useClickOutside from '@/hooks/useClickOutside';
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

const MENU_HEIGHT = 3;

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
        top: `calc(${menuState.selectionMenuPosition.y}px - ${MENU_HEIGHT}rem)`,
        left: menuState.selectionMenuPosition.x,
      }}
      className={container}
    >
      {SELECTION_MENU_ITEMS.map((item, index) => (
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

const container = css({
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

export default SelectionMenu;
