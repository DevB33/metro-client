import { memo, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import handleInput from './_handler/handleInput';
import handleKeyDown from './_handler/handleKeyDown';
import BlockTag from './block-tag';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  setKey: (key: number) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  startOffest: number;
  setStartOffset: (startOffset: number) => void;
  setEndOffset: (endOffset: number) => void;
  startBlockIndex: number;
  setStartBlockIndex: (startBlockIndex: number) => void;
  endBlockIndex: number;
  setEndBlockIndex: (endBlockIndex: number) => void;
  startChildNodeIndex: number;
  setStartChildNodeIndex: (startChildNodeIndex: number) => void;
  endChildNodeIndex: number;
  setEndChildNodeIndex: (endChildNodeIndex: number) => void;
  isUp: boolean;
  setIsUp: (isUp: boolean) => void;
}

const blockDiv = css({
  boxSizing: 'border-box',
  width: 'full',
  minHeight: '1.5rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
});

const Block = memo(
  ({
    block,
    index,
    blockRef,
    blockList,
    setBlockList,
    isTyping: _isTyping,
    setIsTyping,
    setKey,
    isDragging,
    setIsDragging,
    startOffest,
    setStartOffset,
    setEndOffset,
    startBlockIndex,
    setStartBlockIndex,
    endBlockIndex,
    setEndBlockIndex,
    startChildNodeIndex,
    setStartChildNodeIndex,
    endChildNodeIndex,
    setEndChildNodeIndex,
    isUp,
    setIsUp,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);

    const prevClientY = useRef(0);

    const selectedBlockIndex = useRef<number | null>(null);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    const handleMouseDown = (e: any) => {
      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const textNode = document.caretPositionFromPoint(e.clientX, e.clientY)?.offsetNode;
      const currentChildNodeIndex =
        childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(textNode.parentNode as HTMLElement)
          : childNodes.indexOf(textNode as HTMLElement);

      setIsDragging(true);
      setIsTyping(false);
      setKey(Math.random());

      selectedBlockIndex.current = index;

      const range = document.createRange();
      const charIdx = document.caretPositionFromPoint(e.clientX, e.clientY)?.offset as number;

      setStartOffset(charIdx);
      setStartBlockIndex(index);
      setStartChildNodeIndex(currentChildNodeIndex);

      setTimeout(() => {
        if (range) {
          blockRef.current[index]?.parentNode?.focus();
          const selection = window.getSelection();
          range?.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex] as Node, charIdx);

          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    };

    const handleMouseMove = (e: any) => {
      if (!isDragging) return;

      if (index !== endBlockIndex) {
        setEndBlockIndex(index);
      }

      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const textNode = document.caretPositionFromPoint(e.clientX, e.clientY)?.offsetNode;
      const currentChildNodeIndex =
        childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(textNode.parentNode as HTMLElement)
          : childNodes.indexOf(textNode as HTMLElement);

      if (currentChildNodeIndex !== endChildNodeIndex) {
        setEndChildNodeIndex(currentChildNodeIndex);
      }

      const charIdx = document.caretPositionFromPoint(e.clientX, e.clientY)?.offset as number;
      setEndOffset(charIdx);

      // 첫 번째 블록에서
      if (index === startBlockIndex && index === endBlockIndex) {
        if (currentChildNodeIndex < startChildNodeIndex) {
          // 왼쪽으로 드래그
          let left = 99999;
          let right = 0;
          childNodes.forEach((childNode, idx) => {
            if (idx <= startChildNodeIndex && idx >= currentChildNodeIndex) {
              const range = document.createRange();
              if (startChildNodeIndex === idx) {
                range.setStart(childNode as Node, 0);
                range.setEnd(childNode as Node, startOffest);
              } else if (currentChildNodeIndex < idx && startChildNodeIndex > idx) {
                range.setStart(childNode as Node, 0);
                range.setEnd(childNode as Node, childNode.textContent?.length || 0);
              } else if (currentChildNodeIndex === idx) {
                range.setStart(childNode as Node, charIdx);
                range.setEnd(childNode as Node, childNode.textContent?.length || 0);
              }
              const rect = range.getBoundingClientRect();
              if (left > rect.left) {
                left = rect.left;
              }

              if (right < rect.right) {
                right = rect.right;
              }
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        } else {
          // 오른쪽으로 드래그
          let left = 99999;
          let right = 0;
          childNodes.forEach((childNode, idx) => {
            if (idx <= currentChildNodeIndex && idx >= startChildNodeIndex) {
              const range = document.createRange();

              if (currentChildNodeIndex === idx && startChildNodeIndex === idx) {
                if (startOffest < charIdx) {
                  range.setStart(childNode as Node, startOffest);
                  range.setEnd(childNode as Node, charIdx);
                } else {
                  range.setStart(childNode as Node, charIdx);
                  range.setEnd(childNode as Node, startOffest);
                }
              } else {
                // eslint-disable-next-line no-lonely-if
                if (currentChildNodeIndex === idx) {
                  range.setStart(childNode as Node, 0);
                  range.setEnd(childNode as Node, charIdx);
                } else if (startChildNodeIndex < idx && currentChildNodeIndex > idx) {
                  range.setStart(childNode as Node, 0);
                  range.setEnd(childNode as Node, childNode.textContent?.length || 0);
                } else if (startChildNodeIndex === idx) {
                  range.setStart(childNode as Node, startOffest);
                  range.setEnd(childNode as Node, childNode.textContent?.length || 0);
                }
              }

              const rect = range.getBoundingClientRect();
              if (left > rect.left) {
                left = rect.left;
              }

              if (right < rect.right) {
                right = rect.right;
              }
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        }
      }

      // 마지막 블록에서
      if (index !== startBlockIndex && index === endBlockIndex) {
        if (startBlockIndex < endBlockIndex) {
          // 아래로 드래그 된 상태일 때
          let left = 99999;
          let right = 0;
          childNodes.forEach((childNode, idx) => {
            if (idx <= currentChildNodeIndex) {
              const range = document.createRange();

              if (currentChildNodeIndex === idx) {
                range.setStart(childNode as Node, 0);
                range.setEnd(childNode as Node, charIdx);
              } else {
                range.setStart(childNode as Node, 0);
                range.setEnd(childNode as Node, childNode.textContent?.length || 0);
              }

              const rect = range.getBoundingClientRect();
              if (left > rect.left) {
                left = rect.left;
              }

              if (right < rect.right) {
                right = rect.right;
              }
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        } else {
          // 위로 드래그 된 상태일 때
          let left = 99999;
          let right = 0;
          childNodes.forEach((childNode, idx) => {
            if (idx >= currentChildNodeIndex) {
              const range = document.createRange();

              if (currentChildNodeIndex === idx) {
                range.setStart(childNode as Node, charIdx);
                range.setEnd(childNode as Node, childNode.textContent?.length || 0);
              } else {
                range.setStart(childNode as Node, 0);
                range.setEnd(childNode as Node, childNode.textContent?.length || 0);
              }

              const rect = range.getBoundingClientRect();
              if (left > rect.left) {
                left = rect.left;
              }

              if (right < rect.right) {
                right = rect.right;
              }
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        }
      }

      if (prevClientY.current < e.clientY) {
        setIsUp(false);
        prevClientY.current = e.clientY;
      } else if (prevClientY.current > e.clientY) {
        setIsUp(true);
        prevClientY.current = e.clientY;
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) return;

      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

      // 아래로 드래그한 상태 일때
      if (startBlockIndex < endBlockIndex) {
        let left = 99999;
        let right = 0;
        if (index !== startBlockIndex && index === endBlockIndex && !isUp) {
          // 아래로 드래그 할 때
          childNodes.forEach(childNode => {
            const range = document.createRange();
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            const rect = range.getBoundingClientRect();
            if (left > rect.left) {
              left = rect.left;
            }

            if (right < rect.right) {
              right = rect.right;
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        } else if (index !== startBlockIndex && index === endBlockIndex && isUp) {
          // 위로 드래그 할 때
          const el = blockRef.current[index];
          if (!el) return;
          el.style.backgroundImage = `none`;
        }
      } else {
        // 위로 드래그한 상태 일 때
        let left = 99999;
        let right = 0;
        // eslint-disable-next-line no-lonely-if
        if (index !== startBlockIndex && index === endBlockIndex && isUp) {
          // 위로 드래그 할 때
          childNodes.forEach(childNode => {
            const range = document.createRange();
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            const rect = range.getBoundingClientRect();
            if (left > rect.left) {
              left = rect.left;
            }

            if (right < rect.right) {
              right = rect.right;
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        } else if (index !== startBlockIndex && index === endBlockIndex && !isUp) {
          // 아래로 드래그 할 때
          const el = blockRef.current[index];
          if (!el) return;
          el.style.backgroundImage = `none`;
        }
      }

      // 시작 블록에서 떠날 때
      if (index === startBlockIndex && index === endBlockIndex) {
        let left = 99999;
        let right = 0;
        if (!isUp) {
          // 위로 떠날 때
          childNodes.forEach((childNode, idx) => {
            const range = document.createRange();
            if (idx > startChildNodeIndex) {
              range.setStart(childNode as Node, 0);
              range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            } else if (idx === startChildNodeIndex) {
              range.setStart(childNode as Node, startOffest);

              range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            }
            const rect = range.getBoundingClientRect();
            if (left > rect.left) {
              left = rect.left;
            }

            if (right < rect.right) {
              right = rect.right;
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        } else {
          // 아래로 떠날 때
          childNodes.forEach((childNode, idx) => {
            const range = document.createRange();
            if (idx < startChildNodeIndex) {
              range.setStart(childNode as Node, 0);
              range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            } else if (idx === startChildNodeIndex) {
              range.setStart(childNode as Node, 0);
              range.setEnd(childNode as Node, startOffest);
            }
            const rect = range.getBoundingClientRect();
            if (left > rect.left) {
              left = rect.left;
            }

            if (right < rect.right) {
              right = rect.right;
            }
          });
          const el = blockRef.current[index];
          const elLeft = el?.getBoundingClientRect().left || 0;
          if (!el) return;
          el.style.backgroundImage = `linear-gradient(to right,
            transparent ${left - elLeft}px,
            lightblue ${left - elLeft}px,
            lightblue ${right - elLeft}px,
            transparent ${right - elLeft}px)`;
        }
      }
    };

    return (
      <div
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        className={`parent ${blockDiv}`}
        onInput={event => {
          setIsTyping(true);
          handleInput(event, index, blockList, setBlockList, blockRef, prevChildNodesLength);
        }}
        onKeyDown={event => {
          handleKeyDown(event, index, blockList, setBlockList, blockRef, setIsTyping, setKey);
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BlockTag block={block} blockList={blockList} index={index} blockRef={blockRef}>
          {block.children.length === 1 && block.children[0].content === '' && <br />}
          {block.children.map(child => {
            if (child.type === 'br') {
              return <br key={Math.random()} />;
            }

            if (child.type === 'text') {
              return child.content;
            }

            return (
              <span key={Math.random()} style={child.style}>
                {child.content}
              </span>
            );
          })}
        </BlockTag>
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
