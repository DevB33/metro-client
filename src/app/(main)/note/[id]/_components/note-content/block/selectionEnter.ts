import ISelectionPosition from '@/types/selection-position';
import { ITextBlock, ITextBlockChild } from '@/types/block-type';

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

const splitChildren = (
  firstRawChildren: ITextBlockChild[],
  secondRawChildren: ITextBlockChild[],
  block: ITextBlock,
  newBlockList: ITextBlock[],
  index: number,
) => {
  const firstChildren =
    firstRawChildren.length > 0
      ? firstRawChildren
      : [
          {
            type: 'text',
            style: defaultStyle,
            content: '',
          },
        ];

  const secondChildren =
    secondRawChildren.length > 0
      ? secondRawChildren
      : [
          {
            type: 'text',
            style: defaultStyle,
            content: '',
          },
        ];

  const firstUpdatedBlock = {
    id: Math.random(),
    type: block.type,
    children: firstChildren as ITextBlock['children'],
  };
  const secondUpdatedBlock = {
    id: Math.random(),
    type: block.type,
    children: secondChildren as ITextBlock['children'],
  };

  // children이 비어있는 경우 제외하고 추가
  const updatedBlocks: ITextBlock[] = [];
  if (firstRawChildren.length > 0) {
    updatedBlocks.push(firstUpdatedBlock);
  }
  if (secondRawChildren.length > 0) {
    updatedBlocks.push(secondUpdatedBlock);
  }

  const splitedBlockList = [...newBlockList.slice(0, index), ...updatedBlocks, ...newBlockList.slice(index + 1)];

  return splitedBlockList;
};

const selectionEnter = (
  selection: ISelectionPosition,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;

  const { blockIndex: startBlockIndex, childNodeIndex: startNodeIndex, offset: startOffset } = selection.start;
  const { blockIndex: endBlockIndex, childNodeIndex: endNodeIndex, offset: endOffset } = selection.end;

  let newBlockList = [...blockList];

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

        const firstRawChildren = [...block.children.slice(0, startNodeIndex), ...(beforeText ? [beforeNode] : [])];

        const secondRawChildren = [...(afterText ? [afterNode] : []), ...block.children.slice(startNodeIndex + 1)];

        newBlockList = splitChildren(firstRawChildren, secondRawChildren, block, newBlockList, index);
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

        const firstRawChildren = [
          ...block.children.slice(0, startNodeIndex),
          ...(startNodeBeforeText ? [startNodeBeforeNode] : []),
        ];

        const secondRawChildren = [
          ...(endNodeAfterText ? [endNodeAfterNode] : []),
          ...block.children.slice(endNodeIndex + 1),
        ];
        newBlockList = splitChildren(firstRawChildren, secondRawChildren, block, newBlockList, index);
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

        const firstRawChildren = [...block.children.slice(0, startNodeIndex), ...(beforeText ? [beforeNode] : [])];

        newBlockList = splitChildren(firstRawChildren, [], block, newBlockList, index);
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

        const secondRawChildren = [...(afterText ? [afterNode] : []), ...block.children.slice(endNodeIndex + 1)];

        newBlockList = splitChildren([], secondRawChildren, block, newBlockList, index);

        // // 첫 블록 위치에 넣고, 마지막 블록 삭제
        // newBlockList[startBlockIndex] = updatedBlock;
        // deleteIndex.push(index);
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
  return newBlockList;
};

export default selectionEnter;
