import ITextBlock from '@/types/block-type';
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
  } else {
    // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
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
};

const mergeBlock = (index: number, blockList: ITextBlock[], setBlockList: (blockList: ITextBlock[]) => void) => {
  const updatedBlockList = [...blockList];

  const previousBlock = updatedBlockList[index - 1];
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
    if (event.nativeEvent.isComposing) {
      return;
    }
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

    // 첫 블록 첫 커서일 때
    if (index === 0 && (currentChildNodeIndex === -1 || currentChildNodeIndex === 0) && startOffset === 0) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());

      // default 블록이 아닐 때는 default로 변경
      if (blockList[index].type !== 'default') {
        const updatedBlockList = [...blockList];
        updatedBlockList[index].type = 'default';
        setBlockList(updatedBlockList);
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
        } else {
          mergeBlock(index, blockList, setBlockList);
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
      }

      return;
    }

    // 줄 또는 블록 합치기 로직
    if (startOffset === 0) {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());
      if (currentChildNodeIndex <= 0) {
        if (blockList[index].type !== 'default') {
          const updatedBlockList = [...blockList];
          updatedBlockList[index].type = 'default';
          setBlockList(updatedBlockList);
        } else {
          mergeBlock(index, blockList, setBlockList);
        }
      } else if (currentChildNodeIndex > 0) {
        mergeLine(index, currentChildNodeIndex, blockList, setBlockList);
      }
    }
  }

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
    }
  }
};

export default handleKeyDown;
