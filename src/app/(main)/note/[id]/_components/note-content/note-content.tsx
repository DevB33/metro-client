'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { css } from '@/../styled-system/css';

import getSelectionInfo from '@/utils/getSelectionInfo';
import { ITextBlock } from '@/types/block-type';
import fillHTMLElementBackgroundImage from '@/utils/fillHTMLElementBackgroundImage';
import ISelectionPosition from '@/types/selection-position';
import BUTTON_OFFSET from '@/constants/button-offset';
import IMenuState from '@/types/menu-type';
import { createBlock, getBlockList } from '@/apis/block';
import BlockButton from './block-button';
import Block from './block/block';
import SelectionMenu from './selection-menu/selection-menu';

const tempNoteContent = css({
  width: '100%',
  height: 'calc(100% - 15rem)',
});

const blockContainer = css({
  boxSizing: 'content-box',
  position: 'relative',
  width: '44.5rem',
  display: 'flex',
  flexDirection: 'row',
  px: '5rem',
  mb: '0.5rem',
});

const fakeBox = css({
  position: 'absolute',
  width: '100vw',
  left: '50%',
  transform: 'translateX(-62%)',
  height: 'var(--block-height)',
  zIndex: '1',

  pointerEvents: 'auto',
});

const NoteContent = () => {
  const blockContainerRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);
  const fakeBoxRef = useRef<(HTMLDivElement | null)[]>([]);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const selectionMenuRef = useRef<HTMLDivElement | null>(null);
  const outSideDragging = useRef(false);
  const isSelection = useRef(false);
  const prevClientY = useRef(0);

  const params = useParams();
  const noteId = params.id as string;
  const { data: blocks } = useSWR(`blockList-${noteId}`);

  const [blockList, setBlockList] = useState<ITextBlock[]>([
    {
      id: '1',
      type: 'DEFAULT',
      nodes: [
        {
          type: 'text',
          content: '',
        },
      ],
    },
  ]);

  const [key, setKey] = useState(Date.now());
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isUp = useRef(false);
  const [dragBlockIndex, setDragBlockIndex] = useState<number | null>(null);

  const [selection, setSelection] = useState<ISelectionPosition>({
    start: { blockIndex: 0, childNodeIndex: 0, offset: 0 },
    end: { blockIndex: 0, childNodeIndex: 0, offset: 0 },
  });

  const [menuState, setMenuState] = useState<IMenuState>({
    isSlashMenuOpen: false,
    slashMenuOpenIndex: null,
    isSelectionMenuOpen: false,
    slashMenuPosition: { x: 0, y: 0 },
    selectionMenuPosition: { x: 0, y: 0 },
  });

  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);

  const createFirstBlock = async () => {
    if (blocks.length === 0) {
      await createBlock({
        noteId,
        type: 'DEFAULT',
        upperOrder: -1,
        nodes: [
          {
            type: 'text',
            content: '',
          },
        ],
      });

      await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
      setTimeout(() => {
        (blockRef.current[0]?.parentNode as HTMLElement)?.focus();
      }, 0);
    }
  };

  const OpenBlockMenu = () => {
    setIsBlockMenuOpen(true);
  };

  const CloseBlockMenu = () => {
    setIsBlockMenuOpen(false);
  };

  // blockButton의 위치를 계산해 style에 적용하는 함수
  const updateBlockButtonPosition = (index: number) => {
    const blockEl = blockRef.current[index];
    const buttonEl = blockButtonRef.current[index];
    const fakeBoxEl = fakeBoxRef.current[index];

    // getBoundingClientRect를 통해 화면 절대 좌표를 구해 적용
    if (blockEl && buttonEl && fakeBoxEl) {
      const blockRect = blockEl.getBoundingClientRect();
      const containerRect = fakeBoxEl.getBoundingClientRect();
      const offsetLeft = blockRect.left - containerRect.left;
      const blockType = blockEl.getAttribute('data-placeholder');

      let left = offsetLeft + BUTTON_OFFSET.default.left;
      let { top } = BUTTON_OFFSET.default;

      switch (blockType) {
        case '리스트':
          left = offsetLeft + BUTTON_OFFSET.list.left;
          top = BUTTON_OFFSET.list.top;
          break;
        case '비어 있는 인용':
          left = offsetLeft + BUTTON_OFFSET.quote.left;
          top = BUTTON_OFFSET.quote.top;
          break;
        case '제목1':
          top = BUTTON_OFFSET.h1.top;
          break;
        case '제목2':
          top = BUTTON_OFFSET.h2.top;
          break;
        case '제목3':
          top = BUTTON_OFFSET.h3.top;
          break;
        default:
          left = offsetLeft + BUTTON_OFFSET.default.left;
          top = BUTTON_OFFSET.default.top;
          break;
      }

      buttonEl.style.position = 'fixed';
      buttonEl.style.top = `${top}px`;
      buttonEl.style.left = `${left}px`;
      buttonEl.style.display = 'flex';
      buttonEl.style.backgroundColor = 'red';
    }
  };

  // Selection의 상태를 초기화 해주는 함수
  const resetSelection = () => {
    setSelection(prev => ({
      ...prev,
      start: { blockIndex: 0, childNodeIndex: 0, offset: 0 },
    }));
    setSelection(prev => ({
      ...prev,
      end: { blockIndex: 0, childNodeIndex: 0, offset: 0 },
    }));
  };

  // FakeBox에 MouseEnter, Leave 시 BlockButton 활성화 및 숨기기
  const handleMouseEnter = (index: number) => {
    updateBlockButtonPosition(index);
  };

  const handleMouseLeave = (index: number) => {
    if (isBlockMenuOpen) return;
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
  };

  // Selection이 활성화 되어있는지 여부를 확인하는 함수
  const isSelectionActive = () => {
    const { blockIndex: startBlock, childNodeIndex: startChild, offset: startOffset } = selection.start;
    const { blockIndex: endBlock, childNodeIndex: endChild, offset: endOffset } = selection.end;
    if (startBlock !== endBlock || startChild !== endChild || startOffset !== endOffset) isSelection.current = true;
    else isSelection.current = false;
  };

  // node의 시작점과 끝점까지 범위의 위치를 계산하는 함수
  const getNodeBounds = (node: Node, startOffset: number, endOffset: number) => {
    const range = document.createRange();
    if (node.nodeType === Node.TEXT_NODE) {
      // 텍스트 노드일 때
      range.setStart(node as Node, startOffset);
      range.setEnd(node as Node, endOffset);
    } else if (node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
      range.setStart(node.firstChild, startOffset);
      range.setEnd(node.firstChild, endOffset);
    } else {
      range.setStart(node as Node, startOffset);
      range.setEnd(node as Node, endOffset);
    }
    return range.getBoundingClientRect();
  };

  // selection의 범위를 구하는 함수
  const getBoundsForSelection = (blockIndex: number, childNodeIndex: number, offset: number) => {
    const parent = blockRef.current[blockIndex];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
    let left = Infinity;
    let top = -Infinity;

    childNodes.forEach((childNode, index) => {
      if (index !== childNodeIndex) return;
      const rect = getNodeBounds(childNode as Node, offset, offset);
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });

    return { left, top };
  };
  const { startContainer, startOffset } = getSelectionInfo(0) || {};

  // selection에 변화가 있을 때, selectionMenu의 위치를 잡는 useEffect
  useEffect(() => {
    let left = 99999;
    let top = 0;
    let rectOffset = 0;

    if (blocks.length === 0) return;

    // selection의 시작 블록이 끝 블록보다 인덱스가 작을 때,
    if (selection.start.blockIndex < selection.end.blockIndex) {
      rectOffset = selection.start.offset;
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selection.start.blockIndex,
        selection.start.childNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }

    // selection의 시작 블록이 끝 블록보다 인덱스가 클 때,
    if (selection.start.blockIndex > selection.end.blockIndex) {
      rectOffset = selection.end.offset;
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selection.end.blockIndex,
        selection.end.childNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }

    // selection의 시작 블록이 끝 블록보다 인덱스가 같을 때,
    if (selection.start.blockIndex === selection.end.blockIndex) {
      // selection의 시작 블록이 끝 블록보다 node 인덱스가 작을 때,
      if (selection.start.childNodeIndex < selection.end.childNodeIndex) {
        rectOffset = selection.start.offset;
        const { left: newLeft, top: newTop } = getBoundsForSelection(
          selection.start.blockIndex,
          selection.start.childNodeIndex,
          rectOffset,
        );
        left = Math.min(left, newLeft);
        top = Math.max(top, newTop);
      }
      // selection의 시작 블록이 끝 블록보다 node 인덱스가 클 때,
      if (selection.start.childNodeIndex > selection.end.childNodeIndex) {
        rectOffset = selection.end.offset;
        const { left: newLeft, top: newTop } = getBoundsForSelection(
          selection.start.blockIndex,
          selection.end.childNodeIndex,
          rectOffset,
        );
        left = Math.min(left, newLeft);
        top = Math.max(top, newTop);
      }
      // selection의 시작 블록이 끝 블록보다 node 인덱스가 같을 때,
      if (selection.start.childNodeIndex === selection.end.childNodeIndex) {
        rectOffset = Math.min(selection.start.offset, selection.end.offset);
        const { left: newLeft, top: newTop } = getBoundsForSelection(
          selection.start.blockIndex,
          selection.start.childNodeIndex,
          rectOffset,
        );
        left = Math.min(left, newLeft);
        top = Math.max(top, newTop);
      }
    }
    // selectionMenu의 위치를 설정
    setMenuState(prev => ({
      ...prev,
      selectionMenuPosition: {
        x: left,
        y: top,
      },
    }));
    // selection이 활성화 되어 있는지 확인
    isSelectionActive();
  }, [selection]);

  // 각 menu들 초기화
  useEffect(() => {
    setMenuState(prev => ({
      ...prev,
      isSlashMenuOpen: false,
      slashMenuOpenIndex: null,
    }));
  }, []);

  // menuState.isSlashMenuOpen 상태에 따라 스크롤 막기
  useEffect(() => {
    const grandParent = noteRef.current?.parentElement?.parentElement?.parentElement;
    if (!grandParent) return;
    if (menuState.isSlashMenuOpen || menuState.isSelectionMenuOpen) {
      grandParent.style.overflowY = 'hidden';
    } else {
      grandParent.style.overflowY = '';
    }

    return () => {
      grandParent.style.overflow = '';
    };
  }, [menuState.isSlashMenuOpen, menuState.isSelectionMenuOpen]);

  // 초기 렌더링 시 block 외의 이벤트를 처리하기 위한 useEffect
  useEffect(() => {
    const handleOutsideMouseUp = (event: MouseEvent) => {
      // Mouse 이벤트가 block위가 아닐때,
      if (blockRef.current.some(block => block?.contains(event.target as Node))) {
        return;
      }
      setIsDragging(false);
      outSideDragging.current = false;

      // 외부에서 MouseUp 시에도 SelectionMenu가 띄워질 수 있도록 함
      if (isSelection.current)
        setMenuState(prev => ({
          ...prev,
          isSelectionMenuOpen: true,
        }));
    };

    const handleOutsideMouseDown = (event: MouseEvent) => {
      // Mouse 이벤트가 block 위일 때,
      if (blockRef.current.some(block => block?.contains(event.target as Node))) {
        outSideDragging.current = false;
        return;
      }
      // 외부에서 MouseDown이 일어났으므로 외부 드래그 true
      outSideDragging.current = true;
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (blockRef.current.some(block => block?.contains(event.target as Node))) {
        return;
      }

      // selectionMenu가 아닌 곳에서 Click 시 resetSelection
      if (selectionMenuRef.current) {
        if (!selectionMenuRef.current.contains(event.target as Node)) resetSelection();
        setKey(Math.random());
      }
    };

    const handleOutsideDrag = (event: MouseEvent) => {
      if (prevClientY.current < event.clientY) {
        isUp.current = false;
        prevClientY.current = event.clientY;
      } else if (prevClientY.current > event.clientY) {
        isUp.current = true;
        prevClientY.current = event.clientY;
      }

      // 외부의 input이나, textarea일 때는 기본 selection이 작동하게 함
      const inputElementList = Array.from(document.querySelectorAll('input, textarea'));
      if (inputElementList.includes(event.target as Element)) return;
      // 외부 드래깅중이라면 window 기본 selection이 작동하지 않도록 함
      if (!outSideDragging.current) return;

      const windowSelection = window.getSelection();
      if (windowSelection) windowSelection.removeAllRanges();
    };

    document.addEventListener('mouseup', handleOutsideMouseUp);
    document.addEventListener('mousedown', handleOutsideMouseDown, true);
    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('mousemove', handleOutsideDrag);

    return () => {
      document.removeEventListener('mouseup', handleOutsideMouseUp);
      document.removeEventListener('mousedown', handleOutsideMouseDown, true);
      document.removeEventListener('click', handleOutsideClick, true);
      document.removeEventListener('mousemove', handleOutsideDrag);
    };
  }, []);

  // Node의 배경을 칠해주는 함수
  const fillBackgroundNode = (left: number, right: number, index: number) => {
    const blockElement = blockRef.current[index];
    const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;

    if (!blockElement) return;
    fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
  };

  const handleFakeBoxMouseEnter = (index: number) => {
    // block 버튼을 누르고 드래그 하기 전에 key를 초기화해서 에러를 가상돔과 돔 조작의 충돌을 방지하기 위한 조건문
    // key를 초기화 하면 focus도 사라져서 다시 줘야함
    if (isTyping) {
      const blockIndex = blockRef.current.findIndex(blockEl => blockEl && blockEl.contains(startContainer as Node));
      const parent = blockRef.current[blockIndex];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const currentChildNodeIndex =
        childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
          : childNodes.indexOf(startContainer as HTMLElement);

      setIsTyping(false);
      setKey(Math.random());

      setTimeout(() => {
        const range = document.createRange();
        const targetNode = blockRef.current[blockIndex]?.childNodes[currentChildNodeIndex];
        if (targetNode?.nodeType === Node.TEXT_NODE) {
          range.setStart(targetNode as Node, startOffset || 0);
        } else range.setStart(targetNode?.firstChild as Node, startOffset || 0);
        const windowSelection = window.getSelection();
        windowSelection?.removeAllRanges();
        windowSelection?.addRange(range);
      }, 100);
    }

    if (!isDragging) return;
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    setSelection(prev => ({
      ...prev,
      end: { ...prev.end, blockIndex: index },
    }));

    // 로컬 변수를 활용해 비동기적 함수 처리
    const selectionEnd = {
      ...selection.end,
      blockIndex: index,
    };

    let left = 99999;
    let right = 0;

    // selction의 시작 블록과 끝 블록이 인덱스가 같을 때, 각 노드 색칠
    if (selection.start.blockIndex === selectionEnd.blockIndex) {
      childNodes.forEach((childNode, idx) => {
        if (idx > selection.start.childNodeIndex) {
          return;
        }
        if (idx < selection.start.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
        if (idx === selection.start.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, selection.start.offset as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
      fillBackgroundNode(left, right, index);
    }

    // selction의 시작 블록과 끝 블록이 인덱스가 클 때, 각 노드 색칠
    if (selection.start.blockIndex > selectionEnd.blockIndex) {
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      });
      fillBackgroundNode(left, right, index);
    }

    // selction의 시작 블록과 끝 블록이 인덱스가 작을 때, 각 노드 색칠
    if (selection.start.blockIndex < selectionEnd.blockIndex) {
      childNodes.forEach((childNode, idx) => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);

        if (idx === childNodes.length - 1) {
          setSelection(prev => ({
            ...prev,
            end: { ...prev.end, childNodeIndex: idx, offset: childNode.textContent?.length || 0 },
          }));
        }
      });
      fillBackgroundNode(left, right, index);
    }
  };

  const handleFakeBoxMouseLeave = (index: number) => {
    if (!isDragging) return;

    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
    const textLength = parent?.textContent?.length || 0;

    // selction의 시작 블록과 끝 블록이 인덱스가 같을 때
    if (selection.start.blockIndex === selection.end.blockIndex) {
      // 첫번째 블록에서 위로 나가면 배경 없애기
      if (isUp && selection.start.blockIndex === 0) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
      }
      // 아래로 나갈 때, 커서 위치부터 끝까지 칠하기
      if (!isUp) {
        let left = 99999;
        let right = 0;

        childNodes.forEach(childNode => {
          const rect = getNodeBounds(
            childNode as Node,
            selection.start.offset,
            childNode.textContent?.length as number,
          );
          left = Math.min(left, rect.left);
          right = Math.max(rect.right);
        });
        fillBackgroundNode(left, right, index);
      }
    }

    // 아래로 드래그한 상태에서 블록을 떠날 때
    if (selection.start.blockIndex < selection.end.blockIndex) {
      if (index === selection.end.blockIndex && isUp) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
      }
      // 아래로 드래그 할 때
      if (index !== selection.start.blockIndex && index === selection.end.blockIndex && !isUp) {
        let left = 99999;
        let right = 0;
        childNodes.forEach(childNode => {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        });
        fillBackgroundNode(left, right, index);
        setSelection(prev => ({
          ...prev,
          end: { ...prev.end, offset: textLength },
        }));
      }
    }
    // 위로 드래그한 상태에서 블록을 떠날 때
    if (selection.start.blockIndex > selection.end.blockIndex) {
      // 아래로 드래그 할 때
      if (index !== selection.start.blockIndex && index === selection.end.blockIndex && !isUp) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
      }

      // 위로 드래그 할 때
      if (index !== selection.start.blockIndex && index === selection.end.blockIndex && isUp) {
        let left = 99999;
        let right = 0;
        childNodes.forEach(childNode => {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        });
        fillBackgroundNode(left, right, index);
      }
    }
  };

  useEffect(() => {
    // 각 블록에 대해 반복하여 해당하는 fakeBox 높이 설정
    blockContainerRef.current.forEach((block, index) => {
      if (block && fakeBoxRef.current[index]) {
        const blockHeight = block.offsetHeight;
        if (blockHeight) {
          fakeBoxRef.current[index]?.style.setProperty('height', `${blockHeight}px`);
        }
      }
    });
  }, [key, blockList]);

  if (blocks.length === 0) {
    return (
      <div
        className={tempNoteContent}
        role="button"
        tabIndex={0}
        aria-label="새 블록 만들기"
        onClick={createFirstBlock}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            createFirstBlock();
          }
        }}
      />
    );
  }

  return (
    <div style={{ pointerEvents: 'none' }}>
      <div
        role="button"
        tabIndex={0}
        key={key}
        ref={noteRef}
        onMouseDown={() =>
          setMenuState(prev => ({
            ...prev,
            isSelectionMenuOpen: false,
          }))
        }
        onKeyDown={() =>
          setMenuState(prev => ({
            ...prev,
            isSelectionMenuOpen: false,
          }))
        }
      >
        {blocks?.map((block: ITextBlock, index: number) => (
          <div
            role="button"
            tabIndex={0}
            key={block.id}
            className={blockContainer}
            ref={element => {
              blockContainerRef.current[index] = element;
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onKeyDown={() => handleMouseLeave(index)}
            onMouseMove={() => handleMouseEnter(index)}
          >
            <div
              className={fakeBox}
              id={`fakeBox-${index}`}
              style={{
                left: `-${(blockContainerRef.current[index]?.getBoundingClientRect().left as number) + 20}px`,
              }}
              ref={element => {
                fakeBoxRef.current[index] = element;
              }}
              onMouseEnter={() => handleFakeBoxMouseEnter(index)}
              onMouseLeave={() => handleFakeBoxMouseLeave(index)}
            >
              <div
                className={css({ display: 'none' })}
                ref={element => {
                  blockButtonRef.current[index] = element;
                }}
              >
                <BlockButton
                  OpenBlockMenu={OpenBlockMenu}
                  CloseBlockMenu={CloseBlockMenu}
                  index={index}
                  block={block}
                  blockList={blocks}
                  setBlockList={setBlockList}
                  blockRef={blockRef}
                  setDragBlockIndex={setDragBlockIndex}
                  setIsTyping={setIsTyping}
                  menuState={menuState}
                  setMenuState={setMenuState}
                  setKey={setKey}
                />
              </div>
            </div>
            <Block
              index={index}
              block={block}
              blockRef={blockRef}
              blockList={blocks}
              setBlockList={setBlockList}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              setKey={setKey}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              isUp={isUp}
              selection={selection}
              setSelection={setSelection}
              menuState={menuState}
              setMenuState={setMenuState}
              dragBlockIndex={dragBlockIndex}
            />
          </div>
        ))}
      </div>
      {menuState.isSelectionMenuOpen && (
        <div ref={selectionMenuRef}>
          <SelectionMenu
            setKey={setKey}
            selection={selection}
            blockList={blockList}
            setBlockList={setBlockList}
            blockRef={blockRef}
            menuState={menuState}
            setMenuState={setMenuState}
            resetSelection={resetSelection}
          />
        </div>
      )}
    </div>
  );
};

export default NoteContent;
