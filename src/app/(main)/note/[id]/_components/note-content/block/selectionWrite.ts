import ISelectionPosition from '@/types/selection-position';
import { ITextBlock } from '@/types/block-type';

const selectionWrite = (
  key: string,
  selection: ISelectionPosition,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;

  const defaultStyle = {
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#000000',
    backgroundColor: 'transparent',
    width: 'auto',
    height: 'auto',
    borderRadius: '0',
  };

  const { blockIndex: startBlockIndex, childNodeIndex: startNodeIndex, offset: startOffset } = selection.start;
  const { blockIndex: endBlockIndex, childNodeIndex: endNodeIndex, offset: endOffset } = selection.end;

  const newBlockList = [...blockList];

  const newNode = {
    type: 'text' as 'text',
    style: {
      fontStyle: 'normal',
      fontWeight: 'regular',
      textDecoration: 'none',
      color: 'black',
      backgroundColor: 'white',
      width: 'auto',
      height: 'auto',
      borderRadius: '0',
    },
    content: key,
  };

  const deleteIndex = [];

  // 블록 인덱스 범위
  for (let index = startBlockIndex; index <= endBlockIndex; index += 1) {
    const block = blockList[index];
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    // 한 블록만 선택한 경우
    if (startBlockIndex === endBlockIndex) {
      // 한 노드 안에서만 선택된 경우
      if (startNodeIndex === endNodeIndex) {
        const startNode = childNodes[startNodeIndex];
        const beforeText = startNode.textContent?.slice(0, startOffset <= endOffset ? startOffset : endOffset) || '';
        const afterText = startNode.textContent?.slice(startOffset <= endOffset ? endOffset : startOffset) || '';
        const beforeNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: beforeText,
        };
        const afterNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: afterText,
        };

        const rawChildren = [
          ...block.children.slice(0, startNodeIndex),
          ...(beforeText ? [beforeNode] : []),
          newNode,
          ...(afterText ? [afterNode] : []),
          ...block.children.slice(startNodeIndex + 1),
        ];
        if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
          rawChildren[0].content = '\u00A0';
        }

        const finalChildren =
          rawChildren.length > 0
            ? rawChildren
            : [
                {
                  type: 'text',
                  style: defaultStyle,
                  content: '',
                },
              ];

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: finalChildren as ITextBlock['children'],
        };

        newBlockList[index] = updatedBlock;
      }
      // 한 블록에서 여러 노드 선택된 경우
      else {
        // 선택 시작 노드 분리
        const startNode = childNodes[startNodeIndex];
        const startNodeBeforeText = startNode.textContent?.slice(0, startOffset) || '';
        const startNodeBeforeNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: startNodeBeforeText,
        };

        // 선택 끝 노드 분리
        const endNode = childNodes[endNodeIndex];
        const endNodeAfterText = endNode.textContent?.slice(endOffset) || '';
        const endNodeAfterNode = {
          type: block.children[endNodeIndex].type,
          style: block.children[endNodeIndex].style,
          content: endNodeAfterText,
        };

        const rawChildren = [
          ...block.children.slice(0, startNodeIndex),
          ...(startNodeBeforeText ? [startNodeBeforeNode] : []),
          newNode,
          ...(endNodeAfterText ? [endNodeAfterNode] : []),
          ...block.children.slice(endNodeIndex + 1),
        ];
        if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
          rawChildren[0].content = '&nbsp;';
        }

        const finalChildren =
          rawChildren.length > 0
            ? rawChildren
            : [
                {
                  type: 'text',
                  style: defaultStyle,
                  content: '',
                },
              ];

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: finalChildren as ITextBlock['children'],
        };

        newBlockList[index] = updatedBlock;
      }
    }

    // 여러 블록을 선택한 경우
    else {
      // 첫 블록인 경우
      if (index === startBlockIndex) {
        // 선택 시작 노드 분리
        const startNode = childNodes[startNodeIndex];
        const beforeText = startNode.textContent?.slice(0, startOffset) || '';
        const beforeNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: beforeText,
        };

        const rawChildren = [...block.children.slice(0, startNodeIndex), ...(beforeText ? [beforeNode] : []), newNode];
        if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
          rawChildren[0].content = '&nbsp;';
        }

        const finalChildren =
          rawChildren.length > 0
            ? rawChildren
            : [
                {
                  type: 'text',
                  style: defaultStyle,
                  content: '',
                },
              ];

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: finalChildren as ITextBlock['children'],
        };

        newBlockList[index] = updatedBlock;
      }

      // 중간 블록인 경우
      if (index > startBlockIndex && index < endBlockIndex) {
        // 해당 블록 삭제
        deleteIndex.push(index);
      }

      // 끝 블록인 경우
      if (index === endBlockIndex) {
        // 선택 끝 노드 분리
        const endNode = childNodes[endNodeIndex];
        const afterText = endNode.textContent?.slice(endOffset) || '';
        const afterNode = {
          type: block.children[endNodeIndex].type,
          style: block.children[endNodeIndex].style,
          content: afterText,
        };

        // 첫 블록 뒤에 붙이기
        const startBlock = newBlockList[startBlockIndex];
        const startBlockChildren = startBlock.children;

        const rawChildren = [
          ...startBlockChildren,
          ...(afterText ? [afterNode] : []),
          ...block.children.slice(endNodeIndex + 1),
        ];
        if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
          rawChildren[0].content = '&nbsp;';
        }

        const finalChildren =
          rawChildren.length > 0
            ? rawChildren
            : [
                {
                  type: 'text',
                  style: defaultStyle,
                  content: '',
                },
              ];

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: finalChildren as ITextBlock['children'],
        };

        // 첫 블록 위치에 넣고, 마지막 블록 삭제
        newBlockList[startBlockIndex] = updatedBlock;
        deleteIndex.push(index);
      }
    }
  }
  // 블록 삭제
  deleteIndex
    .sort((a, b) => b - a)
    .forEach(index => {
      newBlockList.splice(index, 1);
    });

  setBlockList(newBlockList);
};

export default selectionWrite;
