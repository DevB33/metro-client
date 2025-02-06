'use client';

import { useState, useRef } from 'react';
import { css } from '@/../styled-system/css';
import { ITextBlock } from '@/types/block-type';
import Block from './block';
import BlockButton from './block-button';

const blockContainer = css({
  display: 'flex',
  flexDirection: 'row',
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
            {isHover[index] && <BlockButton />}
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
