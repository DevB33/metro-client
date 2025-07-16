import { useState, useEffect, useCallback, JSX } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'next/navigation';
import { mutate } from 'swr';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import IMenuState from '@/types/menu-type';
import { createBlock, getBlockList, updateBlocksOrder, updateBlockType, deleteBlock } from '@/apis/block';
import { getNoteList } from '@/apis/note';
import HeadingOneIcon from '@/icons/heading-one-icon';
import HeadingTwoIcon from '@/icons/heading-two-icon';
import HeadingThreeIcon from '@/icons/heading-three-icon';
import BulletedListIcon from '@/icons/bulleted-list-icon';
import NumberedListIcon from '@/icons/numbered-list-icon';
import QuoteIcon from '@/icons/quote-icon';
import PageIcon from '@/icons/menu-page-icon';
import TextIcon from '@/icons/text-icon';
import { useClickOutside } from '@/hooks/useClickOutside';

interface ISlashMenuProps {
  index: number;
  blockList: ITextBlock[];
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
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

const MENU_ITEMS: {
  label: string;
  type: 'DEFAULT' | 'H1' | 'H2' | 'H3' | 'UL' | 'OL' | 'QUOTE' | 'PAGE';
  icon: JSX.Element;
  markdown: string;
}[] = [
  { label: 'Heading 1', type: 'H1', icon: <HeadingOneIcon color="black" />, markdown: '#' },
  { label: 'Heading 2', type: 'H2', icon: <HeadingTwoIcon color="black" />, markdown: '##' },
  { label: 'Heading 3', type: 'H3', icon: <HeadingThreeIcon color="black" />, markdown: '###' },
  { label: 'Bulleted List', type: 'UL', icon: <BulletedListIcon color="black" />, markdown: '-' },
  { label: 'Numbered List', type: 'OL', icon: <NumberedListIcon color="black" />, markdown: '1.' },
  { label: 'Quote', type: 'QUOTE', icon: <QuoteIcon color="black" />, markdown: '|' },
  { label: 'Page', type: 'PAGE', icon: <PageIcon color="black" />, markdown: '' },
  { label: 'Text', type: 'DEFAULT', icon: <TextIcon color="black" />, markdown: '' },
];

const SlashMenu = ({ index, blockList, blockRef, menuState, setMenuState, openedBySlashKey }: ISlashMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slashMenuRef = useClickOutside(() => {
    setMenuState(prev => ({
      ...prev,
      isSlashMenuOpen: false,
      slashMenuOpenIndex: null,
    }));
  });

  const params = useParams();
  const noteId = params.id as string;

  const makeBlock = useCallback(
    async (type: 'DEFAULT' | 'H1' | 'H2' | 'H3' | 'UL' | 'OL' | 'QUOTE' | 'PAGE') => {
      if (index !== blockList.length - 1) {
        await updateBlocksOrder(
          noteId,
          blockList[index + 1].order,
          blockList[blockList.length - 1].order,
          blockList[index + 1].order,
        );
      }

      await createBlock({
        noteId,
        type,
        upperOrder: blockList[index].order,
        nodes: [{ content: '', type: 'text' }],
      });

      if (type === 'PAGE' && index === blockList.length - 1) {
        await createBlock({
          noteId,
          type: 'DEFAULT',
          upperOrder: blockList[index].order + 1,
          nodes: [{ content: '', type: 'text' }],
        });
      }

      await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
      await mutate('noteList', getNoteList, false);

      setMenuState(prev => ({
        ...prev,
        isSlashMenuOpen: false,
        slashMenuOpenIndex: null,
      }));

      setTimeout(() => {
        const parent1 = blockRef.current[index + 1]?.parentNode as HTMLElement;
        const parent2 = parent1?.parentNode as HTMLElement;
        const parent3 = parent2?.parentNode as HTMLElement;

        if (type === 'UL' || type === 'OL') {
          parent3?.focus();
        } else if (type === 'QUOTE') {
          parent2?.focus();
        } else {
          parent1?.focus();
        }
      }, 0);
    },
    [noteId, blockList, index, blockRef, setMenuState],
  );

  const changeBlock = useCallback(
    async (type: 'DEFAULT' | 'H1' | 'H2' | 'H3' | 'UL' | 'OL' | 'QUOTE' | 'PAGE') => {
      if (type === 'PAGE') {
        await deleteBlock(noteId, blockList[index].order, blockList[index].order);
        await createBlock({
          noteId,
          type: 'PAGE',
          upperOrder: blockList[index - 1].order,
          nodes: [{ content: '', type: 'text' }],
        });
      } else {
        await updateBlockType(blockList[index].id, type);
      }

      await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
      await mutate('noteList', getNoteList, false);

      setMenuState(prev => ({
        ...prev,
        isSlashMenuOpen: false,
        slashMenuOpenIndex: null,
      }));

      setTimeout(() => {
        const parent1 = blockRef.current[index]?.parentNode as HTMLElement;
        const parent2 = parent1?.parentNode as HTMLElement;
        const parent3 = parent2?.parentNode as HTMLElement;

        if (type === 'UL' || type === 'OL') {
          parent3?.focus();
        } else if (type === 'QUOTE') {
          parent2?.focus();
        } else {
          parent1?.focus();
        }
      }, 0);
    },
    [noteId, blockList, index, blockRef, setMenuState],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % MENU_ITEMS.length);
      } else if (event.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (event.key === 'Enter') {
        if (blockList[index].nodes[0].content === '') {
          changeBlock(MENU_ITEMS[selectedIndex].type);
        } else {
          makeBlock(MENU_ITEMS[selectedIndex].type);
        }
      }
    };

    // TODO: 이벤트 리스너를 document말고 다른곳에 달기
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, index, blockList, menuState.isSlashMenuOpen, changeBlock, makeBlock]);

  return menuState.isSlashMenuOpen && menuState.slashMenuOpenIndex === index
    ? ReactDOM.createPortal(
        <div
          style={{ top: menuState.slashMenuPosition.y, left: menuState.slashMenuPosition.x }}
          className={menu}
          ref={slashMenuRef}
        >
          <div className={menuTitle}>blocks</div>
          {MENU_ITEMS.map((item, i) => (
            <div
              tabIndex={0}
              role="button"
              key={item.label}
              className={`${slashButton} ${selectedIndex === i ? selectedButton : ''}`}
              onClick={() => {
                if (openedBySlashKey) {
                  if (blockList[index].nodes[0].content === '') {
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
                    if (blockList[index].nodes[0].content === '') {
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

export default SlashMenu;
