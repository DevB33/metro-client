import { mutate } from 'swr';

import {
  createBlock,
  deleteBlock,
  getBlockList,
  updateBlockNodes,
  updateBlocksOrder,
  updateBlockType,
} from '@/apis/block';
import { ITextBlock } from '@/types/block-type';
import getSelectionInfo from '@/utils/getSelectionInfo';
import keyName from '@/constants/key-name';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import editSelectionContent from '../../selection-menu/editSelectionContent';

// 현재 블록의 맨 앞에 focus
const focusBlock = (
  indexToFocus: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  blockList: ITextBlock[],
) => {
  setTimeout(() => {
    if (blockList[indexToFocus].type === 'UL' || blockList[indexToFocus].type === 'OL') {
      (blockRef.current[indexToFocus]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
    } else if (blockList[indexToFocus].type === 'QUOTE') {
      (blockRef.current[indexToFocus]?.parentNode?.parentNode as HTMLElement)?.focus();
    } else {
      (blockRef.current[indexToFocus]?.parentNode as HTMLElement)?.focus();
    }
  }, 0);
};

const focusAfterSelection = (
  selection: ISelectionPosition,
  isBackward: boolean,
  key: string,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  let target = isBackward ? selection.end : selection.start;
  if (key === keyName.arrowRight) {
    target = isBackward ? selection.start : selection.end;
  }

  const { blockIndex, childNodeIndex, offset } = target;
  const targetBlockNode = blockRef.current[blockIndex];
  const targetNode = targetBlockNode?.childNodes[childNodeIndex];

  setTimeout(() => {
    if (targetNode) {
      const newRange = document.createRange();
      const windowSelection = window.getSelection();

      if (targetNode.nodeType === Node.TEXT_NODE) {
        newRange.setStart(targetNode, offset);
        newRange.collapse(true);

        windowSelection?.removeAllRanges();
        windowSelection?.addRange(newRange);
      } else {
        if (targetNode.nodeName === 'BR') {
          newRange.setStart(targetNode as Node, Math.min(offset, targetNode.textContent?.length ?? 0));
        } else {
          newRange.setStart(targetNode.firstChild as Node, Math.min(offset, targetNode.textContent?.length ?? 0));
        }
        newRange.collapse(true);

        windowSelection?.removeAllRanges();
        windowSelection?.addRange(newRange);
      }
    }
  }, 0);
};

const splitBlock = async (
  index: number,
  blockList: ITextBlock[],
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  noteId: string,
) => {
  const { startOffset, startContainer } = getSelectionInfo(0) || {};
  if (startOffset === undefined || startOffset === null || !startContainer) return;

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const currentChildNodeIndex =
    childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
      : childNodes.indexOf(startContainer as HTMLElement);

  const beforeText = currentChildNodeIndex === -1 ? '' : startContainer.textContent?.slice(0, startOffset) || '';
  const afterText = currentChildNodeIndex === -1 ? '' : startContainer.textContent?.slice(startOffset) || '';

  const beforeBlock = childNodes
    .filter((_node, idx) => {
      return currentChildNodeIndex === -1 ? idx <= startOffset : idx <= currentChildNodeIndex;
    })
    .map((node, idx) => {
      if ((currentChildNodeIndex === -1 && idx === startOffset) || idx === currentChildNodeIndex) {
        if (beforeText === '' && idx !== 0) {
          return;
        }

        if (node.nodeName === 'SPAN') {
          const newNode = document.createElement('span');
          newNode.style.cssText = node.style.cssText;
          newNode.textContent = beforeText;
          return newNode;
        }

        const newNode = document.createTextNode(beforeText);
        return newNode;
      }
      return node;
    })
    .filter(node => node != null);

  const afterBlock = childNodes
    .filter((_node, idx) => {
      return currentChildNodeIndex === -1 ? idx >= startOffset : idx >= currentChildNodeIndex;
    })
    .map((node, idx) => {
      if (idx === 0) {
        const filteredNodeCount = childNodes.filter((_node, i) => {
          return currentChildNodeIndex === -1 ? idx >= startOffset : i >= currentChildNodeIndex;
        }).length;
        if (afterText === '' && idx !== filteredNodeCount - 1) {
          return;
        }

        if (node.nodeName === 'SPAN') {
          const newNode = document.createElement('span');
          newNode.style.cssText = node.style.cssText;
          newNode.textContent = afterText;
          return newNode;
        }

        const newNode = document.createTextNode(afterText);
        return newNode;
      }
      return node;
    })
    .filter(node => node != null);

  const updatedBlockList = [...blockList];

  const newBeforeBlock = beforeBlock.map(node => {
    if (node.nodeName === 'BR') {
      return {
        type: 'br' as 'br',
      };
    }

    if (node.nodeName === 'SPAN') {
      return {
        type: 'span' as 'span',
        style: {
          fontStyle: node instanceof HTMLElement ? node.style.fontStyle : 'normal',
          fontWeight: node instanceof HTMLElement ? node.style.fontWeight : 'regular',
          textDecoration: 'none',
          color: node instanceof HTMLElement ? node.style.color : 'black',
          backgroundColor: node instanceof HTMLElement ? node.style.backgroundColor : 'white',
          width: 'auto',
          height: 'auto',
          borderRadius: '0',
        },
        content: node.textContent || '',
      };
    }

    return {
      type: 'text' as 'text',
      content: node.textContent || '',
    };
  });

  const newAfterBlock = afterBlock.map(node => {
    if (node.nodeName === 'BR') {
      return {
        type: 'br' as 'br',
      };
    }

    if (node.nodeName === 'SPAN') {
      return {
        type: 'span' as 'span',
        style: {
          fontStyle: node instanceof HTMLElement ? node.style.fontStyle : 'normal',
          fontWeight: node instanceof HTMLElement ? node.style.fontWeight : 'regular',
          textDecoration: 'none',
          color: node instanceof HTMLElement ? node.style.color : 'black',
          backgroundColor: node instanceof HTMLElement ? node.style.backgroundColor : 'white',
          width: 'auto',
          height: 'auto',
          borderRadius: '0',
        },
        content: node.textContent || '',
      };
    }

    return {
      type: 'text' as 'text',
      content: node.textContent || '',
    };
  });

  // 한 줄의 맨 앞에 커서를 두고 블록 나눌 때 beforeBlock 맨 뒤에 br 추가
  if (newBeforeBlock[newBeforeBlock.length - 1]?.type === 'br' && beforeText === '') {
    newBeforeBlock.push({
      type: 'br' as 'br',
    });
  }

  // 빈 줄에서 블록 나눌 때 afterBlock 맨 앞에 br 추가
  if (beforeText === '' && afterText === '') {
    newAfterBlock.unshift({
      type: 'br' as 'br',
    });
  }

  if (newAfterBlock.length === 1 && newAfterBlock[0]?.type === 'br') {
    newAfterBlock[0] = {
      type: 'text',
      content: '',
    };
  }

  updatedBlockList[index].nodes = newBeforeBlock;

  if (newAfterBlock.length === 2 && newAfterBlock[0].type === 'br') {
    newAfterBlock.shift();
  }

  updatedBlockList.splice(index + 1, 0, {
    id: `${Date.now()}`,
    type: 'DEFAULT',
    nodes: newAfterBlock,
    order: updatedBlockList[index].order + 1,
  });

  // 현재 블록 업데이트
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  // 현재 블록 이후 블록 뒤로 한칸씩 미루기
  await updateBlocksOrder(
    noteId,
    updatedBlockList[index + 1].order,
    updatedBlockList[blockList.length - 1].order,
    updatedBlockList[index + 1].order,
  );
  // 현재 블록 바로 뒤에 블록 생성
  await createBlock({
    noteId,
    type: 'DEFAULT',
    upperOrder: updatedBlockList[index].order,
    nodes: newAfterBlock,
  });
  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

  focusBlock(index + 1, blockRef, updatedBlockList);
};

const splitLine = async (
  index: number,
  blockList: ITextBlock[],
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  noteId: string,
) => {
  const { startOffset, startContainer } = getSelectionInfo(0) || {};
  if (startOffset === undefined || startOffset === null || !startContainer) return;

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const currentChildNodeIndex =
    childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
      : childNodes.indexOf(startContainer as HTMLElement);
  const newChildren = [...blockList[index].nodes];

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textBefore = startContainer.textContent?.substring(0, startOffset);
    const textAfter = startContainer.textContent?.substring(startOffset);

    const parentNode = startContainer.parentNode as HTMLElement;
    const isSpan = parentNode?.tagName === 'SPAN';

    // 줄 바꿈이 반영된 children 배열 생성
    const updatedChildren = [
      ...newChildren.slice(0, currentChildNodeIndex),
      textBefore && {
        type: !isSpan ? 'text' : 'span',
        style: isSpan
          ? {
              fontStyle: parentNode?.style.fontStyle,
              fontWeight: parentNode?.style.fontWeight,
              color: parentNode?.style.color,
              backgroundColor: parentNode?.style.backgroundColor,
              width: 'auto',
              height: 'auto',
            }
          : null,
        content: textBefore || '',
      },
      textBefore && textAfter
        ? {
            type: 'br' as 'br',
          }
        : null,
      textAfter && {
        type: !isSpan ? 'text' : 'span',
        style: isSpan
          ? {
              fontStyle: parentNode?.style.fontStyle,
              fontWeight: parentNode?.style.fontWeight,
              color: parentNode?.style.color,
              backgroundColor: parentNode?.style.backgroundColor,
              width: 'auto',
              height: 'auto',
            }
          : null,
        content: textAfter || '',
      },
      ...newChildren.slice(currentChildNodeIndex + 1),
    ]
      .map(child => {
        if (child === '') {
          return {
            type: 'br' as 'br',
          };
        }

        return child;
      })
      .filter(child => child !== null);

    // 줄의 맨 마지막에서 줄바꿈을 할 떄는 <br> 태그가 하나 더 추가 되야함 ex) 줄바꿈 후 두 번째 줄이 빈 문자열일 때: ""<br><br>
    if (
      updatedChildren[updatedChildren.length - 1]?.type === 'br' &&
      updatedChildren[updatedChildren.length - 2]?.type !== 'br'
    ) {
      updatedChildren.push({
        type: 'br' as 'br',
      });
    }

    const updatedBlockList = [...blockList];
    updatedBlockList[index] = {
      ...updatedBlockList[index],
      nodes: updatedChildren as ITextBlock['nodes'],
    };

    // 현재 블록 업데이트
    await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  } else if ((startContainer as HTMLElement).tagName === 'BR') {
    // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
    // 직접 focus를 줄 때는 startContainer가 <br>로 잡힘
    const updatedBlockList = [...blockList];
    if (updatedBlockList[index].nodes.length === 1 && updatedBlockList[index].nodes[0].content === '') {
      updatedBlockList[index].nodes[0] = {
        type: 'br',
      };
    }
    updatedBlockList[index].nodes.splice(currentChildNodeIndex, 0, {
      type: 'br',
    });

    // 현재 블록 업데이트
    await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  } else {
    // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
    // 직접 focus를 주지 않을 때는 startContainer가 부모로 잡혀 text node와 br이 아님
    const updatedBlockList = [...blockList];
    if (updatedBlockList[index].nodes.length === 1 && updatedBlockList[index].nodes[0].content === '') {
      updatedBlockList[index].nodes[0] = {
        type: 'br',
      };
    }
    updatedBlockList[index].nodes.splice(startOffset, 0, {
      type: 'br',
    });

    // 현재 블록 업데이트
    await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  }

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

  // 줄 바꿈 후 focus를 바뀐줄 맨 앞에 주는 로직
  setTimeout(() => {
    const newChildNodes = Array.from(blockRef.current[index]?.childNodes as NodeListOf<HTMLElement>);
    const range = document.createRange();

    if (
      (currentChildNodeIndex === 0 && startOffset === 0) ||
      (childNodes[currentChildNodeIndex - 1]?.nodeName === 'BR' && startOffset === 0)
    ) {
      // 줄의 맨 앞에 커서를 두고 줄바꿈 했을 때
      range.setStart(newChildNodes[currentChildNodeIndex + 1], 0);
    } else if (currentChildNodeIndex === -1) {
      // 직접 focus를 주지 않은 상태에서 빈 줄에서 줄바꿈 했을 때
      range.setStart(newChildNodes[startOffset + 1], 0);
    } else {
      range.setStart(newChildNodes[startOffset === 0 ? currentChildNodeIndex + 1 : currentChildNodeIndex + 2], 0);
    }

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, 0);
};

const mergeBlock = async (
  index: number,
  blockList: ITextBlock[],
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  noteId: string,
) => {
  const updatedBlockList = [...blockList];

  const previousBlock = updatedBlockList[index - 1];
  const previousBlockFirstChildContent = previousBlock.nodes[0].content;
  const previousBlockLength = previousBlock.nodes.length as number;
  const currentBlock = updatedBlockList[index];

  // 이전 블록의 마지막이 <br>인 상태에서 블록을 합치면 이전 블록의 <br> 제거
  if (previousBlock.nodes[previousBlock.nodes.length - 1].type === 'br') {
    previousBlock.nodes.pop();
  }

  const updatedChildren = [...previousBlock.nodes, ...currentBlock.nodes];

  updatedBlockList[index - 1].nodes = updatedChildren;
  updatedBlockList.splice(index, 1);

  // 빈 블록 두개 합치기 후 빈 텍스트 노드가 두개 중복해서 생기면 하나 지우기
  if (
    updatedBlockList[index - 1].nodes.length === 2 &&
    updatedBlockList[index - 1].nodes[0].content === '' &&
    updatedBlockList[index - 1].nodes[1].content === ''
  ) {
    updatedBlockList[index - 1].nodes.shift();
  }

  // 현재 블록의 바로 이전 블록 업데이트
  await updateBlockNodes(blockList[index - 1].id, updatedBlockList[index - 1].nodes);
  // 현재 블록 삭제
  await deleteBlock(noteId, blockList[index].order, blockList[index].order);
  // 현재 블록 이후 블록 앞으로 한칸 씩 당기기
  // 현재 블록이 마지막 블록이 아닐 때만 당김
  if (index < blockList.length - 1) {
    await updateBlocksOrder(
      noteId,
      blockList[index + 1].order,
      blockList[blockList.length - 1].order,
      blockList[index - 1].order,
    );
  }

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

  // 블록을 합친 뒤 합친 블록 사이에 focus를 주는 로직
  const range = document.createRange();
  setTimeout(() => {
    if (range) {
      const afterBlock = blockRef.current[index - 1];
      const selection = window.getSelection();

      if (
        afterBlock?.childNodes[0]?.nodeName !== 'BR' &&
        currentBlock.nodes.length === 1 &&
        (currentBlock.nodes[0].type === 'text' || 'span') &&
        currentBlock.nodes[0].content === ''
      ) {
        // 빈 블록에서 빈블록이 아닌 블록으로 합쳐질 때
        const prevChildNodesLength = afterBlock ? afterBlock.childNodes.length - 1 : 0;

        if (afterBlock?.childNodes[prevChildNodesLength]?.nodeType === Node.TEXT_NODE) {
          range?.setStart(
            blockRef.current[index - 1]?.childNodes[prevChildNodesLength] as Node,
            blockRef.current[index - 1]?.childNodes[prevChildNodesLength]?.textContent?.length ?? 0,
          );
        } else {
          range?.setStart(
            blockRef.current[index - 1]?.childNodes[prevChildNodesLength]?.firstChild as Node,
            blockRef.current[index - 1]?.childNodes[prevChildNodesLength]?.textContent?.length ?? 0,
          );
        }
      } else {
        // 빈 블록에서 빈블록이 아닌 블록으로 합쳐질 때를 제외한 나머지
        // 이전 블록이 빈 블록이면 합쳐지면서 child가 사라져서 previousBlockLength - 1을 해줌
        range?.setStart(
          afterBlock?.childNodes[
            previousBlockFirstChildContent === '' && previousBlockLength === 1
              ? previousBlockLength - 1
              : previousBlockLength
          ] as Node,
          0,
        );
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, 0);
};

const mergeLine = async (
  index: number,
  currentChildNodeIndex: number,
  blockList: ITextBlock[],
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  noteId: string,
) => {
  const updatedBlockList = [...blockList];
  const newChildren = [...blockList[index].nodes];
  newChildren.splice(currentChildNodeIndex - 1, 1);
  updatedBlockList[index] = { ...updatedBlockList[index], nodes: newChildren };

  // 현재 블록 업데이트
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

  // 줄이 합쳐질 때 이전 합친 줄 사이에 focus를 주는 로직
  setTimeout(() => {
    const newChildNodes = Array.from(blockRef.current[index]?.childNodes as NodeListOf<HTMLElement>);
    const range = document.createRange();

    //  TODO: 중복 줄바꿈인 상태일 때인데 지금 이상한 상태여서 수정해야함
    if (newChildNodes[currentChildNodeIndex - 2]?.nodeName === 'BR' || currentChildNodeIndex === 1) {
      range.setStart(newChildNodes[currentChildNodeIndex - 1], 0);
    }

    // a줄 <br> b줄 인 상황에서 b줄에서 백스페이스를 누르면 포커스가 a줄 맨 마지막 노드의 맨 마지막 offset으로 focus
    // b줄의 맨 앞이 currentChildNodeIndex일 때 <br>은 currentChildNodeIndex - 1, a줄의 맨 마지막 노드는 currentChildNodeIndex - 2
    if (newChildNodes[currentChildNodeIndex - 2].nodeName === 'SPAN') {
      range.setStart(
        newChildNodes[currentChildNodeIndex - 2].firstChild as Node,
        newChildNodes[currentChildNodeIndex - 2].textContent?.length as number,
      );
    } else {
      range.setStart(
        newChildNodes[currentChildNodeIndex - 2],
        newChildNodes[currentChildNodeIndex - 2].textContent?.length as number,
      );
    }

    const selection = window.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
  }, 0);
};

const openSlashMenu = (
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>,
) => {
  setMenuState(prev => ({
    ...prev,
    isSlashMenuOpen: true,
    slashMenuOpenIndex: index,
  }));

  // 메뉴 띄울 슬래시 위치 받아오기
  const { range } = getSelectionInfo(0) || {};
  let rect = range ? range.getBoundingClientRect() : null;

  if (!rect || (rect.left === 0 && rect.top === 0)) {
    const blockElement = blockRef.current?.[index];
    if (blockElement) {
      rect = blockElement.getBoundingClientRect();
    }
  }

  if (rect) {
    setMenuState(prev => ({
      ...prev,
      slashMenuPosition: {
        x: rect.left,
        y: rect.top - 282,
      },
    }));
  }
};

const turnIntoH1 = async (index: number, blockList: ITextBlock[], noteId: string) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].nodes[0].content = (updatedBlockList[index].nodes[0].content as string).substring(1);
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await updateBlockType(blockList[index].id, 'H1');

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
};

const turnIntoH2 = async (index: number, blockList: ITextBlock[], noteId: string) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].nodes[0].content = (updatedBlockList[index].nodes[0].content as string).substring(2);
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await updateBlockType(blockList[index].id, 'H2');

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
};

const turnIntoH3 = async (index: number, blockList: ITextBlock[], noteId: string) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].nodes[0].content = (updatedBlockList[index].nodes[0].content as string).substring(3);
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await updateBlockType(blockList[index].id, 'H3');

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
};

const turnIntoUl = async (index: number, blockList: ITextBlock[], noteId: string) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].nodes[0].content = (updatedBlockList[index].nodes[0].content as string).substring(1);
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await updateBlockType(blockList[index].id, 'UL');

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
};

const turnIntoOl = async (index: number, blockList: ITextBlock[], noteId: string, offset: number) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].nodes[0].content = (updatedBlockList[index].nodes[0].content as string).substring(offset);
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await updateBlockType(blockList[index].id, 'OL');

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
};

const turnIntoQuote = async (index: number, blockList: ITextBlock[], noteId: string) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].nodes[0].content = (updatedBlockList[index].nodes[0].content as string).substring(1);
  await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
  await updateBlockType(blockList[index].id, 'QUOTE');

  await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
};

const isInputtableKey = (e: KeyboardEvent) => {
  // return e.key.length === 1 && /^[a-zA-Z가-힣0-9!@#\$%\^\&*\)\(+=._-]+$/.test(e.key);

  // 조합 중인 한글은 무시
  if (e.isComposing) return false;

  // 단일 글자 or 스페이스바만 허용
  return e.key.length === 1 || e.key === ' ';
};

const handleKeyDown = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  setIsTyping: (isTyping: boolean) => void,
  setKey: (key: number) => void,
  menuState: IMenuState,
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>,
  selection: ISelectionPosition,
  noteId: string,
) => {
  // selection 없을때
  if (!menuState.isSelectionMenuOpen) {
    if (
      event.shiftKey &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')
    ) {
      event.preventDefault();
    }
    // enter 클릭
    if (event.key === keyName.enter && !event.shiftKey) {
      event.preventDefault();
      if (event.nativeEvent.isComposing) {
        return;
      }
      setIsTyping(false);
      setKey(Math.random());
      splitBlock(index, blockList, blockRef, noteId);
    }

    // shift + enter 클릭
    if (event.key === keyName.enter && event.shiftKey) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());
      splitLine(index, blockList, blockRef, noteId);
    }

    // 일반 backspace 클릭
    if (event.key === keyName.backspace && !menuState.isSelectionMenuOpen) {
      const { startOffset, startContainer } = getSelectionInfo(0) || {};
      if (startOffset === undefined || startOffset === null || !startContainer) return;

      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const currentChildNodeIndex =
        childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
          : childNodes.indexOf(startContainer as HTMLElement);

      // 첫 블록 첫 커서일 때
      if (index === 0 && (currentChildNodeIndex === -1 || currentChildNodeIndex === 0) && startOffset === 0) {
        event.preventDefault();

        // default 블록이 아닐 때는 default로 변경
        if (blockList[index].type !== 'DEFAULT') {
          setIsTyping(false);
          setKey(Math.random());

          const updatedBlockList = [...blockList];
          updatedBlockList[index].type = 'DEFAULT';
          setBlockList(updatedBlockList);
          focusBlock(index, blockRef, blockList);
        }
        return;
      }

      // 한 줄이 다 지워졌을 때
      if (currentChildNodeIndex === -1) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());

        if (startOffset === 0) {
          // 블록 합치기 로직
          if (blockList[index].type !== 'DEFAULT') {
            // default 블록이 아닐 때는 블록을 합치는 대신 블록을 default로 변경
            const updatedBlockList = [...blockList];
            updatedBlockList[index].type = 'DEFAULT';
            setBlockList(updatedBlockList);
            focusBlock(index, blockRef, blockList);
          } else {
            mergeBlock(index, blockList, blockRef, noteId);
          }
        } else {
          // 줄 합치기 로직
          const updatedBlockList = [...blockList];

          if (
            updatedBlockList[index].nodes[startOffset - 1].type === 'br' &&
            (!updatedBlockList[index].nodes[startOffset - 2] ||
              updatedBlockList[index].nodes[startOffset - 2].type !== 'br') &&
            !updatedBlockList[index].nodes[startOffset + 1]
          ) {
            updatedBlockList[index].nodes.splice(startOffset - 1, 2);
          } else {
            updatedBlockList[index].nodes.splice(startOffset, 1);
          }

          // 현재 블록 업데이트
          await updateBlockNodes(blockList[index].id, updatedBlockList[index].nodes);
          await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

          // 한 줄이 다 지워진 상태에서의 줄 합치기 일때 focus를 주는 로직
          setTimeout(() => {
            const newChildNodes = Array.from(blockRef.current[index]?.childNodes as NodeListOf<HTMLElement>);
            const range = document.createRange();

            // 한줄이 다 지워졌을때는 startContainer가 부모로 잡히기 때문에 현재 위치를 startOffset으로 알 수 있음
            // 따라서 줄이 지워질 때 startOffset - 1인 노드에 마지막에 focus
            // 빈 줄이 2개만 있을 때 두 번째 줄에서 첫 번째 줄로 합치면 newChildNodes[startOffset - 1] 이 undefined가 됨
            // 따라서 undefined일 때는 블록의 내용이 모두 지워졌을 때 이므로 현재 block에 focus
            if (newChildNodes[startOffset - 1]) {
              range.setStart(
                newChildNodes[startOffset - 1],
                newChildNodes[startOffset - 1].textContent?.length as number,
              );
            } else {
              focusBlock(index, blockRef, blockList);
            }
            const windowSelection = window.getSelection();

            windowSelection?.removeAllRanges();
            windowSelection?.addRange(range);
          }, 0);
        }

        return;
      }

      // 줄 또는 블록 합치기 로직
      if (startOffset === 0) {
        if (currentChildNodeIndex <= 0) {
          event.preventDefault();
          setIsTyping(false);
          setKey(Math.random());

          if (blockList[index].type !== 'DEFAULT') {
            const updatedBlockList = [...blockList];
            updatedBlockList[index].type = 'DEFAULT';
            setBlockList(updatedBlockList);
            focusBlock(index, blockRef, blockList);
          } else {
            mergeBlock(index, blockList, blockRef, noteId);
          }
        } else if (currentChildNodeIndex > 0) {
          if (blockList[index].nodes[currentChildNodeIndex - 1].type === 'br') {
            event.preventDefault();
            setIsTyping(false);
            setKey(Math.random());

            mergeLine(index, currentChildNodeIndex, blockList, blockRef, noteId);
          }
        }
      }
    }

    // space 클릭
    if (event.key === keyName.space) {
      const { startOffset, startContainer } = getSelectionInfo(0) || {};
      if (startOffset === undefined || startOffset === null || !startContainer) return;

      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const currentChildNodeIndex =
        childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
          : childNodes.indexOf(startContainer as HTMLElement);

      // h1으로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 1 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '#' &&
        blockList[index].type !== 'H1'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoH1(index, blockList, noteId);
        focusBlock(index, blockRef, blockList);
      }

      // h2로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 2 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '#' &&
        startContainer.textContent[1] === '#' &&
        blockList[index].type !== 'H2'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoH2(index, blockList, noteId);
        focusBlock(index, blockRef, blockList);
      }

      // h3으로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 3 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '#' &&
        startContainer.textContent[1] === '#' &&
        startContainer.textContent[2] === '#' &&
        blockList[index].type !== 'H3'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoH3(index, blockList, noteId);
        focusBlock(index, blockRef, blockList);
      }

      // ul로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 1 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '-' &&
        blockList[index].type !== 'UL'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoUl(index, blockList, noteId);
        focusBlock(index, blockRef, blockList);
      }

      // ol로 전환
      if (
        currentChildNodeIndex === 0 &&
        startContainer.textContent &&
        startContainer.textContent[startOffset - 1] === '.' &&
        /^\d+$/.test(startContainer.textContent.slice(0, startOffset - 1)) &&
        blockList[index].type !== 'OL'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoOl(index, blockList, noteId, startOffset);
        focusBlock(index, blockRef, blockList);
      }

      // 인용문으로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 1 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '|' &&
        blockList[index].type !== 'QUOTE'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoQuote(index, blockList, noteId);
        focusBlock(index, blockRef, blockList);
      }
    }

    // slash 클릭
    if (event.key === keyName.slash) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());
      openSlashMenu(index, blockRef, setMenuState);
    }

    // 방향키 클릭
    if (
      event.key === keyName.arrowUp ||
      event.key === keyName.arrowDown ||
      event.key === keyName.arrowLeft ||
      event.key === keyName.arrowRight
    ) {
      const { range, startOffset, startContainer } = getSelectionInfo(0) || {};
      const rect = range?.getBoundingClientRect() as DOMRect;
      const cursorX = rect?.left;
      const firstChild = blockRef.current[index]?.childNodes[0];
      const lastChild = blockRef.current[index]?.childNodes[(blockRef.current[index]?.childNodes.length as number) - 1];

      // 이전 블록으로 커서 이동
      if (event.key === keyName.arrowUp && index > 0) {
        event.preventDefault();
        // 현재 위치에서 y좌표만 위로 10 높은 곳에 focus
        const caret = document.caretPositionFromPoint(cursorX, rect.top - 10) as CaretPosition;
        if (blockList[index].nodes.length === 1 && blockList[index].nodes[0].content === '') {
          // 빈 블록으로 갈때는 그냥 그 블록에 focus
          focusBlock(index - 1, blockRef, blockList);
        } else {
          setTimeout(() => {
            if (range) {
              const { offsetNode, offset } = caret;
              const newRange = document.createRange();
              const windowSelection = window.getSelection();

              newRange.setStart(offsetNode, offset);

              windowSelection?.removeAllRanges();
              windowSelection?.addRange(newRange);
            }
          }, 0);
        }
      }

      // 다음 블록으로 커서 이동
      if (event.key === keyName.arrowDown && index < blockList.length - 1) {
        event.preventDefault();
        // 현재 위치에서 y좌표만 아래로 10 낮은 곳에 focus
        const caret = document.caretPositionFromPoint(cursorX, rect.bottom + 10) as CaretPosition;
        if (blockList[index].nodes.length === 1 && blockList[index].nodes[0].content === '') {
          // 빈 블록으로 갈때는 그냥 그 블록에 focus
          focusBlock(index + 1, blockRef, blockList);
        } else {
          setTimeout(() => {
            if (range) {
              const { offsetNode, offset } = caret;
              const newRange = document.createRange();
              const windowSelection = window.getSelection();

              newRange.setStart(offsetNode, offset);
              windowSelection?.removeAllRanges();
              windowSelection?.addRange(newRange);
            }
          }, 0);
        }
      }

      // 블록의 맨 끝에서 오른쪽 방향키 클릭하면 다음 블록으로 커서 이동
      if (
        event.key === keyName.arrowRight &&
        ((startOffset === (lastChild?.textContent?.length as number) && startContainer === lastChild) ||
          (blockList[index].nodes.length === 1 && blockList[index].nodes[0].content === '')) &&
        index < blockList.length - 1
      ) {
        event.preventDefault();
        focusBlock(index + 1, blockRef, blockList);
      }

      // 블록의 맨 앞에서 왼쪽 방향키 클릭하면 이전 블록으로 커서 이동
      if (event.key === keyName.arrowLeft) {
        if (
          ((startOffset === 0 && startContainer === firstChild) ||
            (startOffset === 0 && startContainer?.firstChild?.firstChild === firstChild?.firstChild) ||
            (blockList[index].nodes.length === 1 && blockList[index].nodes[0].content === '')) &&
          index > 0
        ) {
          const prevBlockNodeLength = (blockRef.current[index - 1]?.childNodes.length as number) - 1;
          const prevBlockLastChild = blockRef.current[index - 1]?.childNodes[prevBlockNodeLength];

          setTimeout(() => {
            if (range) {
              if (blockList[index - 1].type === 'UL' || blockList[index - 1].type === 'OL') {
                (blockRef.current[index - 1]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
              } else if (blockList[index - 1].type === 'QUOTE') {
                (blockRef.current[index - 1]?.parentNode?.parentNode as HTMLElement)?.focus();
              } else {
                (blockRef.current[index - 1]?.parentNode as HTMLElement)?.focus();
              }

              const windowSelection = window.getSelection();
              if (prevBlockLastChild?.nodeType === Node.TEXT_NODE)
                range?.setStart(prevBlockLastChild as Node, prevBlockLastChild?.textContent?.length as number);
              else {
                range?.setStart(
                  blockRef.current[index - 1]?.childNodes[prevBlockNodeLength]?.firstChild as Node,
                  blockRef.current[index - 1]?.childNodes[prevBlockNodeLength]?.firstChild?.textContent
                    ?.length as number,
                );
              }
              range.collapse(true);

              windowSelection?.removeAllRanges();
              windowSelection?.addRange(range);
            }
          }, 0);
        }
      }
    }
  }

  // selection 있을때
  if (menuState.isSelectionMenuOpen) {
    event.preventDefault();
    setIsTyping(false);
    setKey(Math.random());

    // selection이 역방향인지 아닌지 판단
    const isBackward =
      selection.start.blockIndex > selection.end.blockIndex ||
      (selection.start.blockIndex === selection.end.blockIndex &&
        selection.start.childNodeIndex > selection.end.childNodeIndex) ||
      (selection.start.blockIndex === selection.end.blockIndex &&
        selection.start.childNodeIndex === selection.end.childNodeIndex &&
        selection.start.offset > selection.end.offset);

    // backspace 클릭
    if (event.key === keyName.backspace) {
      await editSelectionContent('delete', noteId, event.key, selection, isBackward, blockList, setBlockList, blockRef);
    }
    // 엔터 입력
    if (event.key === keyName.enter && !event.shiftKey) {
      if (!isBackward) {
        await editSelectionContent(
          'enter',
          noteId,
          event.key,
          selection,
          isBackward,
          blockList,
          setBlockList,
          blockRef,
        );
        selection.start.blockIndex += 1;
        selection.start.childNodeIndex = 0;
        selection.start.offset = 0;
      } else {
        await editSelectionContent(
          'enter',
          noteId,
          event.key,
          selection,
          isBackward,
          blockList,
          setBlockList,
          blockRef,
        );
        selection.end.blockIndex += 1;
        selection.end.childNodeIndex = 0;
        selection.end.offset = 0;
      }
    }
    // 다른 키 입력
    else if (isInputtableKey(event.nativeEvent)) {
      if (!isBackward) {
        await editSelectionContent(
          'write',
          noteId,
          event.key,
          selection,
          isBackward,
          blockList,
          setBlockList,
          blockRef,
        );

        // selection start가 처음부터여서 해당 노드가 다 지워지고 새로운 노드가 생긴거면 노드 인덱스는 그대로, offset은 1
        if (selection.start.offset === 0) {
          // 한 줄 전체가 지워진 경우
          if (selection.start.childNodeIndex === 0) {
            selection.start.childNodeIndex = 0;
          }
          selection.start.offset = 1;
        }
        // selection start가 처음부터가 아니라 해당 노드가 다 지워지지 않고 새로운 노드가 생긴거면 노드 인덱스는 +1, offset은 1
        else {
          selection.start.childNodeIndex += 1;
          selection.start.offset = 1;
        }
      } else {
        await editSelectionContent(
          'write',
          noteId,
          event.key,
          selection,
          isBackward,
          blockList,
          setBlockList,
          blockRef,
        );

        // selection start가 처음부터여서 해당 노드가 다 지워지고 새로운 노드가 생긴거면 노드 인덱스는 그대로, offset은 1
        if (selection.end.offset === 0) {
          // 한 줄 전체가 지워진 경우
          if (selection.start.childNodeIndex === 0) {
            selection.end.childNodeIndex = 0;
          }
          selection.end.offset = 1;
        }
        // selection start가 처음부터가 아니라 해당 노드가 다 지워지지 않고 새로운 노드가 생긴거면 노드 인덱스는 +1, offset은 1
        else {
          selection.end.childNodeIndex += 1;
          selection.end.offset = 1;
        }
      }
    }

    await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

    setTimeout(() => {
      focusAfterSelection(selection, isBackward, event.key, blockRef);
    }, 0);
  }
};

export default handleKeyDown;
