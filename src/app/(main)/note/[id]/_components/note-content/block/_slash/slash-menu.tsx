import { useState, useEffect, JSX } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import HeadingOneIcon from '@/icons/heading-one-icon';
import HeadingTwoIcon from '@/icons/heading-two-icon';
import HeadingThreeIcon from '@/icons/heading-three-icon';
import BulletedListIcon from '@/icons/bulleted-list-icon';
import NumberedListIcon from '@/icons/numbered-list-icon';
import QuoteIcon from '@/icons/quote-icon';
import TextIcon from '@/icons/text-icon';
import ReactDOM from 'react-dom';
import { useClickOutside } from '@/hooks/useClickOutside';

interface ISlashMenuProps {
  position: { x: number; y: number };
  index: number;
  blockList: ITextBlock[];
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  setBlockList: (blockList: ITextBlock[]) => void;
  isSlashMenuOpen: boolean;
  setIsSlashMenuOpen: (isSlashMenu: boolean) => void;
  openedBySlashKey: boolean;
}

const menu = css({
  position: 'fixed',
  width: '17rem',
  height: '17rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'white',
  border: '1px solid lightgray',
  borderRadius: '.3rem',
  boxShadow: 'dropDown',
  fontSize: 'md',
  padding: 'tiny',
  zIndex: '1000',
});

const menuTitle = css({
  fontSize: '.8rem',
  fontWeight: 'bold',
  color: 'gray',
});

const slashButton = css({
  width: '100%',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '.3rem',
  px: 'tiny',
  gap: 'tiny',
  cursor: 'pointer',
});

const selectedButton = css({
  backgroundColor: 'lightgray',
});

const buttonName = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
  width: '100%',
});

const markdown = css({
  fontSize: '.9rem',
  color: 'grey',
});

const MENU_ITEMS: {
  label: string;
  type: 'default' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote';
  icon: JSX.Element;
  markdown: string;
}[] = [
  { label: 'Heading 1', type: 'h1', icon: <HeadingOneIcon color="black" />, markdown: '#' },
  { label: 'Heading 2', type: 'h2', icon: <HeadingTwoIcon color="black" />, markdown: '##' },
  { label: 'Heading 3', type: 'h3', icon: <HeadingThreeIcon color="black" />, markdown: '###' },
  { label: 'Bulleted List', type: 'ul', icon: <BulletedListIcon color="black" />, markdown: '-' },
  { label: 'Numbered List', type: 'ol', icon: <NumberedListIcon color="black" />, markdown: '1.' },
  { label: 'Quote', type: 'quote', icon: <QuoteIcon color="black" />, markdown: '|' },
  { label: 'Text', type: 'default', icon: <TextIcon color="black" />, markdown: '' },
];

const SlashMenu = ({
  position,
  index,
  blockList,
  blockRef,
  setBlockList,
  isSlashMenuOpen,
  setIsSlashMenuOpen,
  openedBySlashKey,
}: ISlashMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slashMenuRef = useClickOutside(() => setIsSlashMenuOpen(false));

  const makeBlock = (type: 'default' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote') => {
    const newBlockList = [...blockList];
    const newBlock: ITextBlock = {
      id: Date.now(),
      type,
      children: [{ type: 'text', content: '' }],
    };
    newBlockList.splice(index + 1, 0, newBlock);
    setBlockList(newBlockList);

    setIsSlashMenuOpen(false);

    setTimeout(() => {
      if (newBlockList[index + 1].type === 'ul' || newBlockList[index + 1].type === 'ol') {
        (blockRef.current[index + 1]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
      } else if (newBlockList[index + 1].type === 'quote') {
        (blockRef.current[index + 1]?.parentNode?.parentNode as HTMLElement)?.focus();
      } else {
        (blockRef.current[index + 1]?.parentNode as HTMLElement)?.focus();
      }
    }, 0);
  };

  const changeBlock = (type: 'default' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote') => {
    const newBlockList = [...blockList];
    newBlockList[index].type = type;
    setBlockList(newBlockList);

    setIsSlashMenuOpen(false);
    setTimeout(() => {
      if (blockList[index].type === 'ul' || blockList[index].type === 'ol') {
        (blockRef.current[index]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
      } else if (blockList[index].type === 'quote') {
        (blockRef.current[index]?.parentNode?.parentNode as HTMLElement)?.focus();
      } else {
        (blockRef.current[index]?.parentNode as HTMLElement)?.focus();
      }
    }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % MENU_ITEMS.length);
      } else if (event.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (event.key === 'Enter') {
        if (blockList[index].children[0].content === '') {
          changeBlock(MENU_ITEMS[selectedIndex].type);
        } else {
          makeBlock(MENU_ITEMS[selectedIndex].type);
        }
      }
    };

    // TODO: 이벤트 리스너를 document말고 다른곳에 달기
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, index, blockList, isSlashMenuOpen]);

  return isSlashMenuOpen
    ? ReactDOM.createPortal(
        <div style={{ top: position.y, left: position.x }} className={menu} ref={slashMenuRef}>
          <div className={menuTitle}>blocks</div>
          {MENU_ITEMS.map((item, i) => (
            <div
              tabIndex={0}
              role="button"
              key={item.label}
              className={`${slashButton} ${selectedIndex === i ? selectedButton : ''}`}
              onClick={() => {
                if (openedBySlashKey) {
                  if (blockList[index].children[0].content === '') {
                    changeBlock(item.type);
                  } else {
                    makeBlock(item.type);
                  }
                } else changeBlock(item.type);
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              onKeyDown={event => {
                if (openedBySlashKey) {
                  if (event.key === 'Enter') {
                    if (blockList[index].children[0].content === '') {
                      changeBlock(item.type);
                    } else {
                      makeBlock(item.type);
                    }
                  }
                } else changeBlock(item.type);
              }}
            >
              <div className={buttonName}>
                {item.icon}
                {item.label}
              </div>
              <div className={markdown}>{item.markdown}</div>
            </div>
          ))}
        </div>,
        document.body,
      )
    : null;
};

export default SlashMenu;
