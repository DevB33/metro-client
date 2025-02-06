'use client';

import { useState, useRef } from 'react';
import { css } from '@/../styled-system/css';
import { ITextBlock } from '@/types/block-type';
import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';
import Block from './block';

const blockContainer = css({
  display: 'flex',
  flexDirection: 'row',
});

const blockBtnContainer = css({
  position: 'absolute',
  left: '-3rem',
  display: 'flex',
  flexDirection: 'row',
  pt: '0.2rem',
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

const focusTextStyle = css({
  position: 'absolute',
  top: '0.1rem',
  color: 'gray',
  fontSize: 'md',
  pointerEvents: 'none',
});

const wrapper = css({
  position: 'relative',
  verticalAlign: 'middle',
});

const NoteContent = () => {
  const [blockList, setBlockList] = useState<ITextBlock[]>([
    {
      id: 1,
      type: 'default',
      children: [
        {
          type: 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            color: 'black',
            backgroundColor: 'white',
            width: 'auto',
            height: 'auto',
          },
          content: '',
        },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean[]>([false]);
  const [isHover, setIsHover] = useState<boolean[]>([]);

  const blockRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    const newHoverState = [...isHover];
    newHoverState[index] = true;
    setIsHover(newHoverState);
  };

  const handleMouseLeave = (index: number) => {
    const newHoverState = [...isHover];
    newHoverState[index] = false;
    setIsHover(newHoverState);
  };

  return (
    <>
      {blockList.map((block, index) => (
        <div className={wrapper} key={block.id}>
          <div
            className={blockContainer}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {isHover[index] && (
              <div className={blockBtnContainer}>
                <div className={blockBtn}>
                  <PlusIcon />
                </div>
                <div className={blockBtn}>
                  <GripVerticalIcon />
                </div>
              </div>
            )}
            {isFocused[index] && block.children[0].content?.trim() === '' && (
              <div className={focusTextStyle}>
                글을 작성하거나 AI를 사용하려면 '스페이스' 키를, 명령어를 사용하려면 '/' 키를
                누르세요.
              </div>
            )}
            <Block
              block={block}
              index={index}
              blockRef={blockRef}
              blockList={blockList}
              setBlockList={setBlockList}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default NoteContent;
