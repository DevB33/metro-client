import ISelectionPosition from '@/types/selection-position';
import { ITextBlock, IBlockStyle } from '@/types/block-type';

import { mutate } from 'swr';

import { getBlockList, updateBlockNodes } from '@/apis/block';

const createNewStyle = (type: string, beforeStyle: IBlockStyle) => {
  if (type === 'bold') {
    return {
      fontWeight: beforeStyle.fontWeight === 'bold' ? 'normal' : 'bold',
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration,
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'italic') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle === 'italic' ? 'normal' : 'italic',
      textDecoration: beforeStyle.textDecoration,
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'underline') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration === 'underline' ? 'none' : 'underline',
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'line-through') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration === 'line-through' ? 'none' : 'line-through',
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'codeblock') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration,
      color: beforeStyle.color === 'red' ? 'black' : 'red',
      backgroundColor:
        beforeStyle.backgroundColor === 'rgba(161, 161, 161, 0.5)' ? 'transparent' : 'rgba(161, 161, 161, 0.5)',
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
};

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

const changeSelectionStyle = async (
  type: string,
  noteId: string,
  selection: ISelectionPosition,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;

  // 역 드레그시 설정
  const {
    blockIndex: startBlockIndex,
    childNodeIndex: startNodeIndex,
    offset: startOffset,
  } = selection.start.blockIndex < selection.end.blockIndex ||
  (selection.start.blockIndex === selection.end.blockIndex &&
    selection.start.childNodeIndex <= selection.end.childNodeIndex)
    ? selection.start
    : selection.end;
  const {
    blockIndex: endBlockIndex,
    childNodeIndex: endNodeIndex,
    offset: endOffset,
  } = selection.start.blockIndex < selection.end.blockIndex ||
  (selection.start.blockIndex === selection.end.blockIndex &&
    selection.start.childNodeIndex <= selection.end.childNodeIndex)
    ? selection.end
    : selection.start;

  const newBlockList = [...blockList];

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
        console.log('startNode', startNode);
        const beforeText = startNode.textContent?.slice(0, startOffset <= endOffset ? startOffset : endOffset) || '';
        const selectedText =
          startNode.textContent?.slice(
            startOffset <= endOffset ? startOffset : endOffset,
            startOffset <= endOffset ? endOffset : startOffset,
          ) || '';
        const afterText = startNode.textContent?.slice(startOffset <= endOffset ? endOffset : startOffset) || '';
        const beforeNode = {
          type: block.nodes[startNodeIndex].type,
          style: block.nodes[startNodeIndex].style,
          content: beforeText,
        };
        console.log('beforeNode', beforeNode);
        const selectedNode = {
          type: 'span',
          style: createNewStyle(type, block.nodes[startNodeIndex].style || defaultStyle),
          content: selectedText,
        };
        const afterNode = {
          type: block.nodes[startNodeIndex].type,
          style: block.nodes[startNodeIndex].style,
          content: afterText,
        };

        const updatedBlock = {
          id: block.id,
          type: block.type,
          nodes: [
            ...block.nodes.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            selectedNode,
            ...(afterText ? [afterNode] : []),
            ...block.nodes.slice(startNodeIndex + 1),
          ] as ITextBlock['nodes'],
          order: block.order,
        };

        // eslint-disable-next-line no-await-in-loop
        await updateBlockNodes(block.id, updatedBlock.nodes);
        // eslint-disable-next-line no-await-in-loop
        await mutate(`blockList-${noteId}`, getBlockList(noteId), false);

        // newBlockList[index] = updatedBlock;
      }
      // 한 블록에서 여러 노드 선택된 경우
      else {
        // 선택 시작 노드 분리
        const startNode = childNodes[startNodeIndex];
        const startNodeBeforeText = startNode.textContent?.slice(0, startOffset) || '';
        const startNodeSelectedText = startNode.textContent?.slice(startOffset) || '';
        const startNodeBeforeNode = {
          type: block.nodes[startNodeIndex].type,
          style: block.nodes[startNodeIndex].style,
          content: startNodeBeforeText,
        };
        const startNodeSelectedNode = {
          type: 'span',
          style: createNewStyle(type, block.nodes[startNodeIndex].style || defaultStyle),
          content: startNodeSelectedText,
        };
        // 선택 끝 노드 분리
        const endNode = childNodes[endNodeIndex];
        const endNodeSelectedText = endNode.textContent?.slice(0, endOffset) || '';
        const endNodeAfterText = endNode.textContent?.slice(endOffset) || '';
        const endNodeSelectedNode = {
          type: 'span',
          style: createNewStyle(type, block.nodes[endNodeIndex].style || defaultStyle),
          content: endNodeSelectedText,
        };
        const endNodeAfterNode = {
          type: block.nodes[endNodeIndex].type,
          style: block.nodes[endNodeIndex].style,
          content: endNodeAfterText,
        };
        // 선택 시작 노드 다음부터 끝 노드 전까지 스타일 변경
        for (let i = startNodeIndex + 1; i < endNodeIndex; i += 1) {
          block.nodes[i].style = createNewStyle(type, block.nodes[i].style || defaultStyle);
          block.nodes[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          nodes: [
            ...block.nodes.slice(0, startNodeIndex),
            ...(startNodeBeforeText ? [startNodeBeforeNode] : []),
            startNodeSelectedNode,
            ...block.nodes.slice(startNodeIndex + 1, endNodeIndex),
            endNodeSelectedNode,
            ...(endNodeAfterText ? [endNodeAfterNode] : []),
            ...block.nodes.slice(endNodeIndex + 1),
          ] as ITextBlock['nodes'],
          order: block.order,
        };

        // eslint-disable-next-line no-await-in-loop
        await updateBlockNodes(block.id, updatedBlock.nodes);
        // eslint-disable-next-line no-await-in-loop
        await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
        // newBlockList[index] = updatedBlock;
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
        console.log('beforeText', beforeText);
        console.log('afterText', afterText);
        console.log('startnode', startNode);
        const beforeNode = {
          type: block.nodes[startNodeIndex].type,
          style: block.nodes[startNodeIndex].style,
          content: beforeText,
        };
        const afterNode = {
          type: 'span',
          style: createNewStyle(type, block.nodes[startNodeIndex].style || defaultStyle),
          content: afterText,
        };

        // 선택 시작 노드 다음부터 끝까지 스타일 변경
        for (let i = startNodeIndex + 1; i < childNodes.length; i += 1) {
          block.nodes[i].style = createNewStyle(type, block.nodes[i].style || defaultStyle);
          block.nodes[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          nodes: [
            ...block.nodes.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            afterNode,
            ...block.nodes.slice(startNodeIndex + 1),
          ] as ITextBlock['nodes'],
          order: block.order,
        };

        // eslint-disable-next-line no-await-in-loop
        await updateBlockNodes(block.id, updatedBlock.nodes);
        // eslint-disable-next-line no-await-in-loop
        await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
        // newBlockList[index] = updatedBlock;
      }

      // 중간 블록인 경우
      if (index > startBlockIndex && index < endBlockIndex) {
        // 처음 노드부터 끝까지 스타일 변경
        for (let i = 0; i < childNodes.length; i += 1) {
          block.nodes[i].style = createNewStyle(type, block.nodes[i].style || defaultStyle);
          block.nodes[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          nodes: [...block.nodes] as ITextBlock['nodes'],
          order: block.order,
        };

        // eslint-disable-next-line no-await-in-loop
        await updateBlockNodes(block.id, updatedBlock.nodes);
        // eslint-disable-next-line no-await-in-loop
        await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
        // newBlockList[index] = updatedBlock;
      }

      // 끝 블록인 경우
      if (index === endBlockIndex) {
        // 선택 끝 노드 분리
        const endNode = childNodes[endNodeIndex];
        const beforeText = endNode.textContent?.slice(0, endOffset) || '';
        const afterText = endNode.textContent?.slice(endOffset) || '';
        const beforeNode = {
          type: 'span',
          style: createNewStyle(type, block.nodes[endNodeIndex].style || defaultStyle),
          content: beforeText,
        };
        const afterNode = {
          type: block.nodes[endNodeIndex].type,
          style: block.nodes[endNodeIndex].style,
          content: afterText,
        };

        // 처음 노드부터 선택 노드 전까지 스타일 변경
        for (let i = 0; i < endNodeIndex; i += 1) {
          block.nodes[i].style = createNewStyle(type, block.nodes[i].style || defaultStyle);
          block.nodes[i].type = 'span';
        }

        const updatedBlock = {
          id: block.id,
          type: block.type,
          nodes: [
            ...block.nodes.slice(0, endNodeIndex),
            beforeNode,
            ...(afterText ? [afterNode] : []),
            ...block.nodes.slice(endNodeIndex + 1),
          ] as ITextBlock['nodes'],
          order: block.order,
        };

        // eslint-disable-next-line no-await-in-loop
        await updateBlockNodes(block.id, updatedBlock.nodes);
        // eslint-disable-next-line no-await-in-loop
        await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
        // newBlockList[index] = updatedBlock;
      }
    }
  }
  setBlockList(newBlockList);
};

export default changeSelectionStyle;
