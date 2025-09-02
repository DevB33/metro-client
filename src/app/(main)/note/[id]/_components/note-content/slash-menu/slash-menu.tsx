import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'next/navigation';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { css } from '@/../styled-system/css';

import { TBlockType, ITextBlock } from '@/types/block-type';
import IMenuState from '@/types/menu-type';
import { createBlock, getBlockList, updateBlocksOrder, updateBlockType, deleteBlock } from '@/apis/client/block';
import { getNoteList } from '@/apis/client/note';
import SWR_KEYS from '@/constants/swr-keys';
import { SLASH_MENU_ITEMS } from '@/constants/menu-items';
import { TOAST_ERRORMESSAGE } from '@/constants/toast-message';
import useClickOutside from '@/hooks/useClickOutside';

interface ISlashMenuProps {
  index: number;
  blockList: ITextBlock[];
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
  openedBySlashKey: boolean;
}

const SlashMenu = ({ index, blockList, blockRef, menuState, setMenuState, openedBySlashKey }: ISlashMenuProps) => {
  const params = useParams();
  const noteId = params.id as string;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const slashMenuRef = useClickOutside(() => {
    setMenuState(prev => ({
      ...prev,
      isSlashMenuOpen: false,
      slashMenuOpenIndex: null,
    }));
  });

  const makeBlock = useCallback(
    async (type: TBlockType) => {
      try {
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

        await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
        await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);

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
      } catch (error) {
        toast.error(TOAST_ERRORMESSAGE.BlockCreate);
      }
    },
    [noteId, blockList, index, blockRef, setMenuState],
  );

  const changeBlock = useCallback(
    async (type: TBlockType) => {
      try {
        if (type === 'PAGE') {
          await deleteBlock(noteId, blockList[index].order, blockList[index].order);
          await createBlock({
            noteId,
            type: 'PAGE',
            upperOrder: index > 0 ? blockList[index - 1].order : -1,
            nodes: [{ content: '', type: 'text' }],
          });
        } else {
          await updateBlockType(blockList[index].id, type);
        }

        await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
        await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);

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
      } catch (error) {
        toast.error(TOAST_ERRORMESSAGE.BlockStyleUpdate);
      }
    },
    [noteId, blockList, index, blockRef, setMenuState],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % SLASH_MENU_ITEMS.length);
      } else if (event.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + SLASH_MENU_ITEMS.length) % SLASH_MENU_ITEMS.length);
      } else if (event.key === 'Enter') {
        if (blockList[index].nodes[0].content === '') {
          changeBlock(SLASH_MENU_ITEMS[selectedIndex].type);
        } else {
          makeBlock(SLASH_MENU_ITEMS[selectedIndex].type);
        }
      }
    };

    // TODO: 이벤트 리스너를 document말고 다른곳에 달기
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, index, blockList, menuState.isSlashMenuOpen, changeBlock, makeBlock]);

  if (!menuState.isSlashMenuOpen || menuState.slashMenuOpenIndex !== index) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      style={{ top: menuState.slashMenuPosition.y, left: menuState.slashMenuPosition.x }}
      className={container}
      ref={slashMenuRef}
    >
      <div className={menuTitle}>blocks</div>
      {SLASH_MENU_ITEMS.map((item, i) => (
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
  );
};

const container = css({
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

export default SlashMenu;
