import ISelectionPosition from '@/types/selection-position';
import { ITextBlock, IBlockStyle } from '@/types/block-type';

const createNewStyle = (type: string, beforeStyle: IBlockStyle) => {
  if (type === 'bold') {
    return {
      fontWeight: beforeStyle.fontWeight === 'bold' ? 'normal' : 'bold',
      fontStyle: beforeStyle.fontStyle,
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
    };
  }
  if (type === 'italic') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle === 'italic' ? 'normal' : 'italic',
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
    };
  }
};

const defaultStyle = {
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#000000',
  backgroundColor: 'transparent',
  width: 'auto',
  height: 'auto',
};

const selectionChange = (
  type: string,
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;

  console.log('selectionStartPosition', selectionStartPosition);
  console.log('selectionEndPosition', selectionEndPosition);

  // 역 드레그시 설정
  const {
    blockIndex: startBlockIndex,
    childNodeIndex: startNodeIndex,
    offset: startOffset,
  } = selectionStartPosition.blockIndex < selectionEndPosition.blockIndex ||
  (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex &&
    selectionStartPosition.childNodeIndex <= selectionEndPosition.childNodeIndex)
    ? selectionStartPosition
    : selectionEndPosition;
  console.log('startBlockIndex', startBlockIndex);
  console.log('startNodeIndex', startNodeIndex);
  console.log('startOffset', startOffset);
  const {
    blockIndex: endBlockIndex,
    childNodeIndex: endNodeIndex,
    offset: endOffset,
  } = selectionStartPosition.blockIndex < selectionEndPosition.blockIndex ||
  (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex &&
    selectionStartPosition.childNodeIndex <= selectionEndPosition.childNodeIndex)
    ? selectionEndPosition
    : selectionStartPosition;
  console.log('endBlockIndex', endBlockIndex);
  console.log('endNodeIndex', endNodeIndex);
  console.log('endOffset', endOffset);

  const newBlockList = [...blockList];

  // 블록 인덱스 범위
  for (let index = startBlockIndex; index <= endBlockIndex; index += 1) {
    console.log('blockNo.', index);
    const block = blockList[index];
    console.log('block', block);
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    // 한 블록만 선택한 경우
    if (startBlockIndex === endBlockIndex) {
      console.log('one block selected');
      // 한 노드 안에서만 선택된 경우
      if (startNodeIndex === endNodeIndex) {
        console.log('one node selected');
        console.log('startOffset', startOffset);
        console.log('endOffset', endOffset);
        const startNode = childNodes[startNodeIndex];
        const beforeText = startNode.textContent?.slice(0, startOffset <= endOffset ? startOffset : endOffset) || '';
        const selectedText =
          startNode.textContent?.slice(
            startOffset <= endOffset ? startOffset : endOffset,
            startOffset <= endOffset ? endOffset : startOffset,
          ) || '';
        const afterText = startNode.textContent?.slice(startOffset <= endOffset ? endOffset : startOffset) || '';
        console.log('beforeText', beforeText);
        console.log('selectedText', selectedText);
        console.log('afterText', afterText);
        const beforeNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: beforeText,
        };
        const selectedNode = {
          type: 'span',
          style: createNewStyle(type, block.children[startNodeIndex].style || defaultStyle),
          content: selectedText,
        };
        const afterNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: afterText,
        };

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: [
            ...block.children.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            selectedNode,
            ...(afterText ? [afterNode] : []),
            ...block.children.slice(startNodeIndex + 1),
          ] as ITextBlock['children'],
        };

        newBlockList[index] = updatedBlock;
        console.log('newBlockList', newBlockList);
      }
      // 한 블록에서 여러 노드 선택된 경우
      else {
        console.log('multiple node selected');
        // 선택 시작 노드 분리
        const startNode = childNodes[startNodeIndex];
        const startNodeBeforeText = startNode.textContent?.slice(0, startOffset) || '';
        const startNodeSelectedText = startNode.textContent?.slice(startOffset) || '';
        const startNodeBeforeNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: startNodeBeforeText,
        };
        const startNodeSelectedNode = {
          type: 'span',
          style: createNewStyle(type, block.children[startNodeIndex].style || defaultStyle),
          content: startNodeSelectedText,
        };
        // 선택 끝 노드 분리
        const endNode = childNodes[endNodeIndex];
        const endNodeSelectedText = endNode.textContent?.slice(0, endOffset) || '';
        const endNodeAfterText = endNode.textContent?.slice(endOffset) || '';
        const endNodeSelectedNode = {
          type: 'span',
          style: createNewStyle(type, block.children[endNodeIndex].style || defaultStyle),
          content: endNodeSelectedText,
        };
        const endNodeAfterNode = {
          type: block.children[endNodeIndex].type,
          style: block.children[endNodeIndex].style,
          content: endNodeAfterText,
        };
        // 선택 시작 노드 다음부터 끝 노드 전까지 스타일 변경
        for (let i = startNodeIndex + 1; i < endNodeIndex; i += 1) {
          block.children[i].style = createNewStyle(type, block.children[i].style || defaultStyle);
          block.children[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: [
            ...block.children.slice(0, startNodeIndex),
            ...(startNodeBeforeText ? [startNodeBeforeNode] : []),
            startNodeSelectedNode,
            ...block.children.slice(startNodeIndex + 1, endNodeIndex),
            endNodeSelectedNode,
            ...(endNodeAfterText ? [endNodeAfterNode] : []),
            ...block.children.slice(endNodeIndex + 1),
          ] as ITextBlock['children'],
        };
        newBlockList[index] = updatedBlock;
        console.log('newBlockList', newBlockList);
      }
    }

    // 여러 블록을 선택한 경우
    else {
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
          style: createNewStyle(type, block.children[startNodeIndex].style || defaultStyle),
          content: afterText,
        };

        // 선택 시작 노드 다음부터 끝까지 스타일 변경
        for (let i = startNodeIndex + 1; i < childNodes.length; i += 1) {
          block.children[i].style = createNewStyle(type, block.children[i].style || defaultStyle);
          block.children[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: [
            ...block.children.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
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
          block.children[i].style = createNewStyle(type, block.children[i].style || defaultStyle);
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
        // 선택 끝 노드 분리
        const endNode = childNodes[endNodeIndex];
        const beforeText = endNode.textContent?.slice(0, endOffset) || '';
        const afterText = endNode.textContent?.slice(endOffset) || '';
        const beforeNode = {
          type: 'span',
          style: createNewStyle(type, block.children[endNodeIndex].style || defaultStyle),
          content: beforeText,
        };
        const afterNode = {
          type: block.children[endNodeIndex].type,
          style: block.children[endNodeIndex].style,
          content: afterText,
        };

        // 처음 노드부터 선택 노드 전까지 스타일 변경
        for (let i = 0; i < endNodeIndex; i += 1) {
          block.children[i].style = createNewStyle(type, block.children[i].style || defaultStyle);
          block.children[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          children: [
            ...block.children.slice(0, endNodeIndex),
            beforeNode,
            ...(afterText ? [afterNode] : []),
            ...block.children.slice(endNodeIndex + 1),
          ] as ITextBlock['children'],
        };

        newBlockList[index] = updatedBlock;
        console.log('newBlockList', newBlockList);
      }
    }
  }

  console.log('FINAL BLOCK LIST: ', newBlockList);
  setBlockList(newBlockList);
};

export default selectionChange;
