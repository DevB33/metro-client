import { css } from '@/../styled-system/css';

import ISelectionPosition from '@/types/selection-position';
import ITextBlock from '@/types/block-type';
import BoldIcon from '@/icons/bold-icon';
import ItalicIcon from '@/icons/italic-icon';
import UnderlineIcon from '@/icons/underline-icon';
import StrikethroughIcon from '@/icons/strikethrough-icon';
import CodeblockIcon from '@/icons/codeblock-icon';
import selectionChange from './selectionChange';

interface ISelectionMenuProps {
  position: { x: number; y: number };
  setKey: (key: number) => void;
  selectionStartPosition: ISelectionPosition;
  selectionEndPosition: ISelectionPosition;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
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
  { label: 'Bold', icon: <BoldIcon color="black" /> },
  { label: 'Italic', icon: <ItalicIcon color="black" /> },
  { label: 'Underline', icon: <UnderlineIcon color="black" /> },
  { label: 'Strikethrough', icon: <StrikethroughIcon color="black" /> },
  { label: 'Codeblock', icon: <CodeblockIcon color="black" /> },
];

const selectionMenu = ({
  position,
  setKey,
  selectionStartPosition,
  selectionEndPosition,
  blockList,
  setBlockList,
  blockRef,
}: ISelectionMenuProps) => {
  const menuHeight = 3;

  const changeBlock = () => {
    console.log('change block');
    selectionChange(selectionStartPosition, selectionEndPosition, blockList, setBlockList, blockRef);
    setKey(Math.random());
  };

  // console.log('selection ON');
  // console.log('selection position', position);

  return (
    <div style={{ top: `calc(${position.y}px - ${menuHeight}rem)`, left: position.x }} className={menu}>
      {MENU_ITEMS.map(item => (
        <div key={item.label} className={slashButton} onClick={() => changeBlock()}>
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default selectionMenu;
