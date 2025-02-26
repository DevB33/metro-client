import { ITextBlock, ITextBlockChild } from '@/types/block-type';
import getSelectionInfo from '@/utils/getSelectionInfo';
import keyName from '@/constants/key-name';

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
        const filteredNodeCount = childNodes.filter(n => n != null).length;
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
          color: node instanceof HTMLElement ? node.style.color : 'black',
          backgroundColor: node instanceof HTMLElement ? node.style.backgroundColor : 'white',
          width: 'auto',
          height: 'auto',
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
          color: node instanceof HTMLElement ? node.style.color : 'black',
          backgroundColor: node instanceof HTMLElement ? node.style.backgroundColor : 'white',
          width: 'auto',
          height: 'auto',
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

  updatedBlockList[index].children = newBeforeBlock;

  updatedBlockList.splice(index + 1, 0, {
    id: Date.now(),
    type: 'default',
    children: newAfterBlock,
  });

  setBlockList(updatedBlockList);

  setTimeout(() => {
    blockRef.current[index + 1]?.focus();
  }, 0);
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
  console.log('parent', parent);
  console.log('childNodes', childNodes);
  console.log('currentChildNodeIndex', currentChildNodeIndex);
  console.log('newChildren', newChildren);
  console.log('startContainer', startContainer);
  console.log('startOffset', startOffset);
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textBefore = startContainer.textContent?.substring(0, startOffset);
    const textAfter = startContainer.textContent?.substring(startOffset);

    const parentNode = startContainer.parentNode as HTMLElement;
    const isDiv = parentNode?.tagName === 'DIV';

    // 줄 바꿈이 반영된 children 배열 생성
    const updatedChildren = [
      ...newChildren.slice(0, currentChildNodeIndex),
      textBefore && {
        type: isDiv ? 'text' : 'span',
        style: {
          fontStyle: isDiv ? 'normal' : parentNode?.style.fontStyle || 'normal',
          fontWeight: isDiv ? 'regular' : parentNode?.style.fontWeight || 'regular',
          color: isDiv ? 'black' : parentNode?.style.color || 'black',
          backgroundColor: isDiv ? 'white' : parentNode?.style.backgroundColor || 'white',
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
        type: isDiv ? 'text' : 'span',
        style: {
          fontStyle: isDiv ? 'normal' : parentNode?.style.fontStyle || 'normal',
          fontWeight: isDiv ? 'regular' : parentNode?.style.fontWeight || 'regular',
          color: isDiv ? 'black' : parentNode?.style.color || 'black',
          backgroundColor: isDiv ? 'white' : parentNode?.style.backgroundColor || 'white',
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
  } else {
    // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
    const updatedBlockList = [...blockList];
    updatedBlockList[index].children.splice(startOffset, 0, {
      type: 'br',
    });

    setBlockList(updatedBlockList);
  }
};

const mergeBlock = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];
  const previousBlock = updatedBlockList[index - 1];
  const currentBlock = updatedBlockList[index];

  previousBlock.children = [...previousBlock.children, ...currentBlock.children];
  updatedBlockList.splice(index, 1);

  setBlockList(updatedBlockList);
};

const mergeLine = (
  index: number,
  currentChildNodeIndex: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
) => {
  const updatedBlockList = [...blockList];
  const newChildren = [...blockList[index].children];
  newChildren.splice(currentChildNodeIndex - 1, 1);
  updatedBlockList[index] = { ...updatedBlockList[index], children: newChildren };

  setBlockList(updatedBlockList);
};

const createSlashNode = (
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  console.log('slash');
  console.log('blockList', blockList);
  const { startOffset, startContainer } = getSelectionInfo(0) || {};
  console.log('startContainer', startContainer);
  console.log('startOffset', startOffset);
  if (startOffset === undefined || startOffset === null || !startContainer) return;
  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const currentChildNodeIndex =
    childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
      : childNodes.indexOf(startContainer as HTMLElement);
  const newChildren = [...blockList[index].children];

  // 현재 커서 위치의 텍스트 요소 찾기
  const currentTextSpan = newChildren[currentChildNodeIndex];

  if (!currentTextSpan || currentTextSpan.type !== 'text') return;

  const originalText = currentTextSpan.content || '';
  const beforeText = originalText.slice(0, startOffset);
  const afterText = originalText.slice(startOffset);

  // `/` 앞에 공백이 없는 경우 함수 실행 중단
  const lastChar = beforeText[beforeText.length - 1].replace(/\u00A0/g, ' ');
  if (beforeText.length > 0 && lastChar !== ' ') {
    return;
  }

  // 새로운 `/` 강조 span 생성
  const newSlashSpan: ITextBlockChild = {
    type: 'span',
    style: {
      fontStyle: 'normal',
      fontWeight: 'regular',
      color: 'black',
      backgroundColor: 'lightgray',
      width: 'auto',
      height: 'auto',
    },
    content: '/',
  };

  // 새로운 children 배열 생성
  const updatedChildren: ITextBlockChild[] = [
    ...newChildren.slice(0, currentChildNodeIndex),
    ...(beforeText ? [{ ...currentTextSpan, content: beforeText }] : []),
    newSlashSpan,
    ...(afterText ? [{ ...currentTextSpan, content: afterText }] : []),
    ...newChildren.slice(currentChildNodeIndex + 1),
  ];

  console.log('updatedChildren', updatedChildren);

  const updatedBlockList = [...blockList];
  console.log('before-BlockList', updatedBlockList);
  updatedBlockList[index] = {
    ...updatedBlockList[index],
    children: updatedChildren,
  };
  console.log('after-BlockList', updatedBlockList);

  setBlockList(updatedBlockList);
};

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  setIsTyping: (isTyping: boolean) => void,
  setKey: (key: number) => void,
) => {
  if (event.key === keyName.enter && !event.shiftKey) {
    event.preventDefault();
    setIsTyping(false);
    setKey(Math.random());
    splitBlock(index, blockList, setBlockList, blockRef);
  }

  if (event.key === keyName.enter && event.shiftKey) {
    event.preventDefault();
    setIsTyping(false);
    setKey(Math.random());
    splitLine(index, blockList, setBlockList, blockRef);
  }

  if (event.key === keyName.backspace) {
    const { startOffset, startContainer } = getSelectionInfo(0) || {};
    if (startOffset === undefined || startOffset === null || !startContainer) return;

    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
    const currentChildNodeIndex =
      childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
        ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
        : childNodes.indexOf(startContainer as HTMLElement);

    // 첫 블록 첫 커서에서 백스페이스 방지
    if (index === 0 && (currentChildNodeIndex === -1 || currentChildNodeIndex === 0) && startOffset === 0) {
      event.preventDefault();
      return;
    }

    // 한 줄이 다 지워졌을 때
    if (currentChildNodeIndex === -1) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());

      if (startOffset === 0) {
        // 블록 합치기 로직
        mergeBlock(index, blockList, setBlockList);
      } else {
        // 줄 합치기 로직
        const updatedBlockList = [...blockList];

        if (
          (updatedBlockList[index].children[startOffset - 1].type === 'br' &&
            updatedBlockList[index].children[startOffset - 2].type !== 'br' &&
            !updatedBlockList[index].children[startOffset + 1]) ||
          updatedBlockList[index].children.length !== blockRef.current[index]?.childNodes.length
        ) {
          updatedBlockList[index].children.splice(startOffset - 1, 2);
        } else {
          updatedBlockList[index].children.splice(startOffset, 1);
        }

        setBlockList(updatedBlockList);
      }

      return;
    }

    // 줄 또는 블록 합치기 로직
    if (startOffset === 0) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());
      if (currentChildNodeIndex <= 0) {
        mergeBlock(index, blockList, setBlockList);
      } else if (currentChildNodeIndex > 0) {
        mergeLine(index, currentChildNodeIndex, blockList, setBlockList);
      }
    }
  }

  if (event.key === '/') {
    event.preventDefault();
    setIsTyping(false);
    setKey(Math.random());
    createSlashNode(index, blockList, setBlockList, blockRef);
  }
};

export default handleKeyDown;
