import { useState, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import HeadingOneIcon from '@/icons/heading-one-icon';
import HeadingTwoIcon from '@/icons/heading-two-icon';
import HeadingThreeIcon from '@/icons/heading-three-icon';
import BulletedListIcon from '@/icons/bulleted-list-icon';
import NumberedListIcon from '@/icons/numbered-list-icon';
import QuoteIcon from '@/icons/quote-icon';
import TextIcon from '@/icons/text-icon';

interface ISlashMenuProps {
  position: { x: number; y: number };
  index: number;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  setIsSlashMenuOpen: (isSlashMenu: boolean) => void;
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
  zIndex: 1000,
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
  backgroundColor: { base: 'none', _hover: '#F1F1F0' },
  borderRadius: '.3rem',
  px: 'tiny',
  gap: 'tiny',
  cursor: 'pointer',
});

const selectedButton = css({
  backgroundColor: 'lightgray', // 선택된 버튼 색상 변경
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

const SlashMenu = ({ position, index, blockList, setBlockList, setIsSlashMenuOpen }: ISlashMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuHeight = 19;

  const changeBlock = (type: 'default' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote') => {
    const newBlockList = [...blockList];
    newBlockList[index].type = type;
    setBlockList(newBlockList);
    setIsSlashMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % MENU_ITEMS.length);
      } else if (event.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (event.key === 'Enter') {
        changeBlock(MENU_ITEMS[selectedIndex].type);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div style={{ top: `calc(${position.y}px - ${menuHeight}rem)`, left: position.x }} className={menu}>
      <div className={menuTitle}>blocks</div>
      {MENU_ITEMS.map((item, i) => (
        <div key={item.label} className={`${slashButton} ${selectedIndex === i ? selectedButton : ''}`}>
          <div className={buttonName}>
            {item.icon}
            {item.label}
          </div>
          <div className={markdown}>{item.markdown}</div>
        </div>
      ))}
    </div>
  );
};

export default SlashMenu;
