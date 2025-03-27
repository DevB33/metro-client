import ISelectionPosition from '@/types/selection-position';
import ITextBlock from '@/types/block-type';

const selectionChange = (
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;
  const newStyle = {
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
    backgroundColor: 'transparent',
    width: 'auto',
    height: 'auto',
  };

  const {
    blockIndex: startBlockIndex,
    childNodeIndex: startNodeIndex,
    offset: startOffset,
  } = selectionStartPosition.blockIndex < selectionEndPosition.blockIndex
    ? selectionStartPosition
    : selectionEndPosition;
  const {
    blockIndex: endBlockIndex,
    childNodeIndex: endNodeIndex,
    offset: endOffset,
  } = selectionStartPosition.blockIndex < selectionEndPosition.blockIndex
    ? selectionEndPosition
    : selectionStartPosition;

  const newBlockList = [...blockList];

  // 블록 인덱스 범위
  for (let index = startBlockIndex; index <= endBlockIndex; index += 1) {
    console.log('blockNo.', index);
    const block = blockList[index];
    console.log('block', block);
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    // 첫 블록인 경우
    if (index === startBlockIndex) {
      // 선택 시작 노드 분리
      const startNode = childNodes[startNodeIndex];
      const beforeText = startNode.textContent?.slice(0, startOffset) || '';
      const afterText = startNode.textContent?.slice(startOffset) || '';
      const beforeNode = {
        type: block.children[startNodeIndex].type,
        style: block.children[startNodeIndex].style,
        content: beforeText,
      };
      const afterNode = {
        type: 'span',
        style: newStyle,
        content: afterText,
      };

      // 선택 시작 노드 다음부터 끝까지 스타일 변경
      for (let i = startNodeIndex + 1; i < childNodes.length; i += 1) {
        block.children[i].style = newStyle;
        block.children[i].type = 'span';
      }

      const updatedBlock = {
        id: block.id,
        type: block.type,
        children: [
          ...block.children.slice(0, startNodeIndex),
          beforeNode,
          afterNode,
          ...block.children.slice(startNodeIndex + 1),
        ] as ITextBlock['children'],
      };

      newBlockList[index] = updatedBlock;
      console.log('newBlockList', newBlockList);
    }

    // 중간 블록인 경우
    if (index > startBlockIndex && index < endBlockIndex) {
      // 처음 노드부터 끝까지 스타일 변경
      for (let i = 0; i < childNodes.length; i += 1) {
        block.children[i].style = newStyle;
        block.children[i].type = 'span';
      }

      const updatedBlock = {
        id: block.id,
        type: block.type,
        children: [...block.children] as ITextBlock['children'],
      };

      newBlockList[index] = updatedBlock;
      console.log('newBlockList', newBlockList);
    }

    // 끝 블록인 경우
    if (index === endBlockIndex) {
      // 선택 시작 노드 분리
      const endNode = childNodes[endNodeIndex];
      const beforeText = endNode.textContent?.slice(0, endOffset) || '';
      const afterText = endNode.textContent?.slice(endOffset) || '';
      const beforeNode = {
        type: 'span',
        style: newStyle,
        content: afterText,
      };
      const afterNode = {
        type: block.children[endNodeIndex].type,
        style: block.children[endNodeIndex].style,
        content: beforeText,
      };

      // 처음 노드부터 선택 노드 전까지 스타일 변경
      for (let i = 0; i < endNodeIndex; i += 1) {
        block.children[i].style = newStyle;
        block.children[i].type = 'span';
      }

      const updatedBlock = {
        id: block.id,
        type: block.type,
        children: [
          ...block.children.slice(0, endNodeIndex),
          beforeNode,
          afterNode,
          ...block.children.slice(endNodeIndex + 1),
        ] as ITextBlock['children'],
      };

      newBlockList[index] = updatedBlock;
      console.log('newBlockList', newBlockList);
    }
  }

  console.log('FINAL BLOCK LIST: ', newBlockList);
  setBlockList(newBlockList);
};

export default selectionChange;
