import { ITextBlock } from '@/types/block-type';
import getSelectionInfo from '@/utils/getSelectionInfo';
import keyName from '@/constants/key-name';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import editSelectionContent from '../../selection-menu/editSelectionContent';

// 현재 블록의 맨 앞에 focus
const focusCurrentBlock = (
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  blockList: ITextBlock[],
) => {
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

      newRange.setStart(targetNode, Math.min(offset, targetNode.textContent?.length ?? 0));
      newRange.collapse(true);

      windowSelection?.removeAllRanges();
      windowSelection?.addRange(newRange);
    }
  }, 0);
};

const splitBlock = (
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
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

  updatedBlockList[index].children = newBeforeBlock;

  updatedBlockList.splice(index + 1, 0, {
    id: Date.now(),
    type: 'default',
    children: newAfterBlock,
  });

  if (updatedBlockList[index + 1].children.length === 2 && updatedBlockList[index + 1].children[0].type === 'br') {
    updatedBlockList[index + 1].children.shift();
  }

  setBlockList(updatedBlockList);

  focusCurrentBlock(index + 1, blockRef, updatedBlockList);
};

const splitLine = (
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  const { startOffset, startContainer } = getSelectionInfo(0) || {};
  if (startOffset === undefined || startOffset === null || !startContainer) return;

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const currentChildNodeIndex =
    childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
      : childNodes.indexOf(startContainer as HTMLElement);
  const newChildren = [...blockList[index].children];

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
        style: {
          fontStyle: !isSpan ? 'normal' : parentNode?.style.fontStyle || 'normal',
          fontWeight: !isSpan ? 'regular' : parentNode?.style.fontWeight || 'regular',
          color: !isSpan ? 'black' : parentNode?.style.color || 'black',
          backgroundColor: !isSpan ? 'white' : parentNode?.style.backgroundColor || 'white',
          width: 'auto',
          height: 'auto',
        },
        content: textBefore || '',
      },
      textBefore && textAfter
        ? {
            type: 'br' as 'br',
          }
        : null,
      textAfter && {
        type: !isSpan ? 'text' : 'span',
        style: {
          fontStyle: !isSpan ? 'normal' : parentNode?.style.fontStyle || 'normal',
          fontWeight: !isSpan ? 'regular' : parentNode?.style.fontWeight || 'regular',
          color: !isSpan ? 'black' : parentNode?.style.color || 'black',
          backgroundColor: !isSpan ? 'white' : parentNode?.style.backgroundColor || 'white',
          width: 'auto',
          height: 'auto',
        },
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
      children: updatedChildren as ITextBlock['children'],
    };

    setBlockList(updatedBlockList);
  } else if ((startContainer as HTMLElement).tagName === 'BR') {
    // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
    // 직접 focus를 줄 때는 startContainer가 <br>로 잡힘
    const updatedBlockList = [...blockList];
    if (updatedBlockList[index].children.length === 1 && updatedBlockList[index].children[0].content === '') {
      updatedBlockList[index].children[0] = {
        type: 'br',
      };
    }
    updatedBlockList[index].children.splice(currentChildNodeIndex, 0, {
      type: 'br',
    });

    setBlockList(updatedBlockList);
  } else {
    // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
    // 직접 focus를 주지 않을 때는 startContainer가 부모로 잡혀 text node와 br이 아님
    const updatedBlockList = [...blockList];
    if (updatedBlockList[index].children.length === 1 && updatedBlockList[index].children[0].content === '') {
      updatedBlockList[index].children[0] = {
        type: 'br',
      };
    }
    updatedBlockList[index].children.splice(startOffset, 0, {
      type: 'br',
    });

    setBlockList(updatedBlockList);
  }

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

const mergeBlock = (
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  const updatedBlockList = [...blockList];

  const previousBlock = updatedBlockList[index - 1];
  const previousBlockFirstChildContent = previousBlock.children[0].content;
  const previousBlockLength = previousBlock.children.length as number;
  const currentBlock = updatedBlockList[index];

  // 이전 블록의 마지막이 <br>인 상태에서 블록을 합치면 이전 블록의 <br> 제거
  if (previousBlock.children[previousBlock.children.length - 1].type === 'br') {
    previousBlock.children.pop();
  }

  const updatedChildren = [...previousBlock.children, ...currentBlock.children];

  updatedBlockList[index - 1].children = updatedChildren;
  updatedBlockList.splice(index, 1);

  // 빈 블록 두개 합치기 후 빈 텍스트 노드가 두개 중복해서 생기면 하나 지우기
  if (
    updatedBlockList[index - 1].children.length === 2 &&
    updatedBlockList[index - 1].children[0].content === '' &&
    updatedBlockList[index - 1].children[1].content === ''
  ) {
    updatedBlockList[index - 1].children.shift();
  }

  setBlockList(updatedBlockList);

  // 블록을 합친 뒤 합친 블록 사이에 focus를 주는 로직
  const range = document.createRange();
  setTimeout(() => {
    if (range) {
      const afterBlock = blockRef.current[index - 1];
      const selection = window.getSelection();

      if (
        afterBlock?.childNodes[0]?.nodeName !== 'BR' &&
        currentBlock.children.length === 1 &&
        (currentBlock.children[0].type === 'text' || 'span') &&
        currentBlock.children[0].content === ''
      ) {
        // 빈 블록에서 빈블록이 아닌 블록으로 합쳐질 때
        if (afterBlock?.childNodes[previousBlockLength - 1].nodeName === 'SPAN') {
          // span일 때는 span의 자식인 textNode로 range 설정
          range?.setStart(
            afterBlock?.childNodes[previousBlockLength - 1].firstChild as Node,
            afterBlock?.childNodes[previousBlockLength - 1].textContent?.length as number,
          );
        } else {
          // textNode일 때는 textNode 자신으로 range 설정
          range?.setStart(
            afterBlock?.childNodes[previousBlockLength - 1] as Node,
            afterBlock?.childNodes[previousBlockLength - 1].textContent?.length as number,
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

const mergeLine = (
  index: number,
  currentChildNodeIndex: number,
  blockList: ITextBlock[],
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  setBlockList: (blockList: ITextBlock[]) => void,
) => {
  const updatedBlockList = [...blockList];
  const newChildren = [...blockList[index].children];
  newChildren.splice(currentChildNodeIndex - 1, 1);
  updatedBlockList[index] = { ...updatedBlockList[index], children: newChildren };

  setBlockList(updatedBlockList);

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

const turnIntoH1 = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].type = 'h1';
  updatedBlockList[index].children[0].content = (updatedBlockList[index].children[0].content as string).substring(1);

  setBlockList(updatedBlockList);
};

const turnIntoH2 = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].type = 'h2';
  updatedBlockList[index].children[0].content = (updatedBlockList[index].children[0].content as string).substring(2);

  setBlockList(updatedBlockList);
};

const turnIntoH3 = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].type = 'h3';
  updatedBlockList[index].children[0].content = (updatedBlockList[index].children[0].content as string).substring(3);

  setBlockList(updatedBlockList);
};

const turnIntoUl = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].type = 'ul';
  updatedBlockList[index].children[0].content = (updatedBlockList[index].children[0].content as string).substring(1);

  setBlockList(updatedBlockList);
};

const turnIntoOl = (
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  offset: number,
) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].type = 'ol';
  updatedBlockList[index].children[0].content = (updatedBlockList[index].children[0].content as string).substring(
    offset,
  );

  setBlockList(updatedBlockList);
};

const turnIntoQuote = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];
  updatedBlockList[index].type = 'quote';
  updatedBlockList[index].children[0].content = (updatedBlockList[index].children[0].content as string).substring(1);

  setBlockList(updatedBlockList);
};

const isInputtableKey = (e: KeyboardEvent) => {
  // return e.key.length === 1 && /^[a-zA-Z가-힣0-9!@#\$%\^\&*\)\(+=._-]+$/.test(e.key);

  // 조합 중인 한글은 무시
  if (e.isComposing) return false;

  // 단일 글자 or 스페이스바만 허용
  return e.key.length === 1 || e.key === ' ';
};

const handleKeyDown = (
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
      splitBlock(index, blockList, setBlockList, blockRef);
    }

    // shift + enter 클릭
    if (event.key === keyName.enter && event.shiftKey) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());
      splitLine(index, blockList, setBlockList, blockRef);
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
        if (blockList[index].type !== 'default') {
          setIsTyping(false);
          setKey(Math.random());

          const updatedBlockList = [...blockList];
          updatedBlockList[index].type = 'default';
          setBlockList(updatedBlockList);
          focusCurrentBlock(index, blockRef, blockList);
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
          if (blockList[index].type !== 'default') {
            // default 블록이 아닐 때는 블록을 합치는 대신 블록을 default로 변경
            const updatedBlockList = [...blockList];
            updatedBlockList[index].type = 'default';
            setBlockList(updatedBlockList);
            focusCurrentBlock(index, blockRef, blockList);
          } else {
            mergeBlock(index, blockList, setBlockList, blockRef);
          }
        } else {
          // 줄 합치기 로직
          const updatedBlockList = [...blockList];

          if (
            updatedBlockList[index].children[startOffset - 1].type === 'br' &&
            (!updatedBlockList[index].children[startOffset - 2] ||
              updatedBlockList[index].children[startOffset - 2].type !== 'br') &&
            !updatedBlockList[index].children[startOffset + 1]
          ) {
            updatedBlockList[index].children.splice(startOffset - 1, 2);
          } else {
            updatedBlockList[index].children.splice(startOffset, 1);
          }

          setBlockList(updatedBlockList);

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
              focusCurrentBlock(index, blockRef, blockList);
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

          if (blockList[index].type !== 'default') {
            const updatedBlockList = [...blockList];
            updatedBlockList[index].type = 'default';
            setBlockList(updatedBlockList);
            focusCurrentBlock(index, blockRef, blockList);
          } else {
            mergeBlock(index, blockList, setBlockList, blockRef);
          }
        } else if (currentChildNodeIndex > 0) {
          if (blockList[index].children[currentChildNodeIndex - 1].type === 'br') {
            event.preventDefault();
            setIsTyping(false);
            setKey(Math.random());

            mergeLine(index, currentChildNodeIndex, blockList, blockRef, setBlockList);
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
        blockList[index].type !== 'h1'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoH1(index, blockList, setBlockList);
        focusCurrentBlock(index, blockRef, blockList);
      }

      // h2로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 2 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '#' &&
        startContainer.textContent[1] === '#' &&
        blockList[index].type !== 'h2'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoH2(index, blockList, setBlockList);
        focusCurrentBlock(index, blockRef, blockList);
      }

      // h3으로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 3 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '#' &&
        startContainer.textContent[1] === '#' &&
        startContainer.textContent[2] === '#' &&
        blockList[index].type !== 'h3'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoH3(index, blockList, setBlockList);
        focusCurrentBlock(index, blockRef, blockList);
      }

      // ul로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 1 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '-' &&
        blockList[index].type !== 'ul'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoUl(index, blockList, setBlockList);
        focusCurrentBlock(index, blockRef, blockList);
      }

      // ol로 전환
      if (
        currentChildNodeIndex === 0 &&
        startContainer.textContent &&
        startContainer.textContent[startOffset - 1] === '.' &&
        /^\d+$/.test(startContainer.textContent.slice(0, startOffset - 1)) &&
        blockList[index].type !== 'ol'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoOl(index, blockList, setBlockList, startOffset);
        focusCurrentBlock(index, blockRef, blockList);
      }

      // 인용문으로 전환
      if (
        currentChildNodeIndex === 0 &&
        startOffset === 1 &&
        startContainer.textContent &&
        startContainer.textContent[0] === '|' &&
        blockList[index].type !== 'quote'
      ) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        turnIntoQuote(index, blockList, setBlockList);
        focusCurrentBlock(index, blockRef, blockList);
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
        if (blockList[index].children.length === 1 && blockList[index].children[0].content === '') {
          // 빈 블록으로 갈때는 그냥 그 블록에 focus
          focusCurrentBlock(index - 1, blockRef, blockList);
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
        if (blockList[index].children.length === 1 && blockList[index].children[0].content === '') {
          // 빈 블록으로 갈때는 그냥 그 블록에 focus
          focusCurrentBlock(index + 1, blockRef, blockList);
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
          (blockList[index].children.length === 1 && blockList[index].children[0].content === '')) &&
        index < blockList.length - 1
      ) {
        event.preventDefault();
        focusCurrentBlock(index + 1, blockRef, blockList);
      }

      // 블록의 맨 앞에서 왼쪽 방향키 클릭하면 이전 블록으로 커서 이동
      if (
        event.key === keyName.arrowLeft &&
        ((startOffset === 0 && startContainer === firstChild) ||
          (blockList[index].children.length === 1 && blockList[index].children[0].content === '')) &&
        index > 0
      ) {
        const prevBlockLastChild =
          blockRef.current[index - 1]?.childNodes[(blockRef.current[index]?.childNodes.length as number) - 1];
        setTimeout(() => {
          if (range) {
            if (blockList[index - 1].type === 'ul' || blockList[index - 1].type === 'ol') {
              (blockRef.current[index - 1]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
            } else if (blockList[index - 1].type === 'quote') {
              (blockRef.current[index - 1]?.parentNode?.parentNode as HTMLElement)?.focus();
            } else {
              (blockRef.current[index - 1]?.parentNode as HTMLElement)?.focus();
            }

            const windowSelection = window.getSelection();
            range?.setStart(prevBlockLastChild as Node, prevBlockLastChild?.textContent?.length as number);
            range.collapse(true);

            windowSelection?.removeAllRanges();
            windowSelection?.addRange(range);
          }
        }, 0);
      }
    }
  }

  // selection 있을때
  if (menuState.isSelectionMenuOpen) {
    event.preventDefault();
    setIsTyping(false);
    setKey(Math.random());

    const isBackward =
      selection.start.blockIndex > selection.end.blockIndex ||
      (selection.start.blockIndex === selection.end.blockIndex &&
        selection.start.childNodeIndex > selection.end.childNodeIndex) ||
      (selection.start.blockIndex === selection.end.blockIndex &&
        selection.start.childNodeIndex === selection.end.childNodeIndex &&
        selection.start.offset > selection.end.offset);

    // backspace 클릭
    if (event.key === keyName.backspace) {
      if (!isBackward) {
        editSelectionContent('delete', event.key, selection, blockList, setBlockList, blockRef);
        if (selection.start.childNodeIndex > 0) {
          selection.start.childNodeIndex -= 1;
          selection.start.offset = 0;
        }
      } else {
        editSelectionContent('delete', event.key, selection, blockList, setBlockList, blockRef);
        if (selection.end.childNodeIndex > 0) {
          selection.end.childNodeIndex -= 1;
          selection.end.offset = 0;
        }
      }
    }
    // 엔터 입력
    if (event.key === keyName.enter && !event.shiftKey) {
      if (!isBackward) {
        editSelectionContent('enter', event.key, selection, blockList, setBlockList, blockRef);
        selection.start.blockIndex += 1;
        selection.start.childNodeIndex = 0;
        selection.start.offset = 0;
      } else {
        editSelectionContent('enter', event.key, selection, blockList, setBlockList, blockRef);
        selection.end.blockIndex += 1;
        selection.end.childNodeIndex = 0;
        selection.end.offset = 0;
      }
    }
    // 다른 키 입력
    else if (isInputtableKey(event.nativeEvent)) {
      if (!isBackward) {
        editSelectionContent('write', event.key, selection, blockList, setBlockList, blockRef);
        selection.start.offset = 1;
        // selection 시작점의 offset이 0이라 시작노드가 다 지워질떄가 아니면 새로 생성된 노드에 focus
        if (selection.start.offset !== 0) {
          selection.start.childNodeIndex += 1;
        }
      } else {
        editSelectionContent('write', event.key, selection, blockList, setBlockList, blockRef);
        selection.end.offset = 1;
        if (selection.end.offset !== 0) {
          selection.end.childNodeIndex += 1;
        }
      }
    }

    setTimeout(() => {
      focusAfterSelection(selection, isBackward, event.key, blockRef);
    }, 0);
  }
};

export default handleKeyDown;
