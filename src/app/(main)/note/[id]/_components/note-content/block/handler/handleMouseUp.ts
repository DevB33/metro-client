import { ITextBlock } from '@/types/block-type';
import IMenuState from '@/types/menu-type';
import ISelectionPosition from '@/types/selection-position';
import getSelectionInfo from '@/utils/getSelectionInfo';

const handleMouseUp = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  blockList: ITextBlock[],
  selection: ISelectionPosition,
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>,
) => {
  if (!blockRef.current || blockRef.current.length === 0) return;
  console.log(blockRef.current[index].getBoundingClientRect());
  // 아래에서 위로 드래그하면 start의 childNoeIndex가 -1 인 경우
  const fixedSelectionStart =
    selection.start.childNodeIndex === -1
      ? { blockIndex: selection.start.blockIndex, childNodeIndex: 0, offset: 0 }
      : selection.start;
  if (selection.start.childNodeIndex === -1) {
    setSelection(prev => ({
      ...prev,
      start: { ...prev.start, childNodeIndex: 0, offset: 0 },
    }));
  }
  // 위에서 아래로 드래그하면 start의 childNodeIndex, offset 값이 end값에 그대로 적용되는 경우
  const fixedSelectionEnd =
    blockRef.current[index]?.childNodes.length === 1 && blockRef.current[index]?.childNodes[0]?.nodeName === 'BR'
      ? { blockIndex: selection.end.blockIndex, childNodeIndex: 0, offset: 0 }
      : selection.end;
  if (blockRef.current[index]?.childNodes.length === 1 && blockRef.current[index]?.childNodes[0]?.nodeName === 'BR') {
    setSelection(prev => ({
      ...prev,
      end: { ...prev.end, childNodeIndex: 0, offset: 0 },
    }));
  }

  const {
    blockIndex: selectionStartBlockIndex,
    childNodeIndex: selectionStartChildNodeIndex,
    offset: selectionStartOffset,
  } = fixedSelectionStart;
  const {
    blockIndex: selectionEndBlockIndex,
    childNodeIndex: selectionEndChildNodeIndex,
    offset: selectionEndOffset,
  } = fixedSelectionEnd;

  // selection.end 재설정
  const finalSelectionEndPosition = {
    blockIndex: selectionEndBlockIndex,
    childNodeIndex: selectionEndChildNodeIndex,
    offset: selectionEndOffset,
  };

  if (index !== selectionEndBlockIndex) {
    finalSelectionEndPosition.blockIndex = index;
  }

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);

  if (currentChildNodeIndex !== selectionEndChildNodeIndex) {
    finalSelectionEndPosition.childNodeIndex = currentChildNodeIndex;
  }

  const { range, startOffset } = getSelectionInfo(0) || {};
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  if (startOffset !== undefined && charIdx !== startOffset) {
    const windowSelection = window.getSelection();
    if (windowSelection) windowSelection.removeAllRanges();
  }

  setTimeout(() => {
    // 빈 블록일 때 클릭 한 블록에 focus
    // block의 타입마다 blockRef의 깊이가 달라서 type에 맞게 focus
    if (blockList[index].nodes.length === 1 && blockList[index].nodes[0].content === '') {
      if (blockList[index].type === 'UL' || blockList[index].type === 'OL') {
        (blockRef.current[index]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
      } else if (blockList[index].type === 'QUOTE') {
        (blockRef.current[index]?.parentNode?.parentNode as HTMLElement)?.focus();
      } else {
        (blockRef.current[index]?.parentNode as HTMLElement)?.focus();
      }
    }

    if (range) {
      const windowSelection = window.getSelection();
      if (currentChildNodeIndex === -1) return;

      const targetNode = blockRef.current[index]?.childNodes[currentChildNodeIndex];

      if (!targetNode) return;
      if (targetNode.nodeType === Node.TEXT_NODE) {
        // 텍스트 노드일 때
        range.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex] as Node, charIdx);
      } else if (targetNode.firstChild && targetNode.firstChild.nodeType === Node.TEXT_NODE) {
        // span 같은 엘리먼트 노드에 텍스트가 있을 경우
        range.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex].firstChild as Node, charIdx);
      }

      windowSelection?.removeAllRanges();
      windowSelection?.addRange(range);
    }
  }, 10);

  finalSelectionEndPosition.offset = charIdx;

  const getNodeBounds = (node: Node, startNodeOffset: number, endNodeOffset: number) => {
    const boundRange = document.createRange();

    let targetNode = node;
    // span 같은 element면 그 안에 있는 텍스트 노드로 변경
    if (node.nodeType !== Node.TEXT_NODE) {
      const firstTextNode = node.childNodes[0];
      if (!firstTextNode || firstTextNode.nodeType !== Node.TEXT_NODE) {
        return new DOMRect();
      }
      targetNode = firstTextNode;
    }

    boundRange.setStart(targetNode as Node, startNodeOffset);
    boundRange.setEnd(targetNode as Node, endNodeOffset);
    return boundRange.getBoundingClientRect();
  };

  const getBoundsForSelection = (blockIndex: number, childNodeIndex: number, offset: number) => {
    const selectionParent = blockRef.current[blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    let left = Infinity;
    let top = -Infinity;

    selectionChildNodes.forEach((childNode, idx) => {
      if (idx !== childNodeIndex) return;
      const rect = getNodeBounds(childNode as Node, offset, offset);
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });

    return { left, top };
  };

  let left = 99999;
  let top = 0;
  let rectOffset = 0;

  if (selectionStartBlockIndex < selectionEndBlockIndex) {
    rectOffset = selectionStartOffset;
    const { left: newLeft, top: newTop } = getBoundsForSelection(
      selectionStartBlockIndex,
      selectionStartChildNodeIndex,
      rectOffset,
    );
    left = Math.min(left, newLeft);
    top = Math.max(top, newTop);
  }

  // selection의 시작 블록이 끝 블록보다 인덱스가 클 때,
  if (selectionStartBlockIndex > selectionEndBlockIndex) {
    rectOffset = selectionEndOffset;
    const { left: newLeft, top: newTop } = getBoundsForSelection(
      selectionEndBlockIndex,
      selectionEndChildNodeIndex,
      rectOffset,
    );
    left = Math.min(left, newLeft);
    top = Math.max(top, newTop);
  }

  // selection의 시작 블록이 끝 블록보다 인덱스가 같을 때,
  if (selectionStartBlockIndex === selectionEndBlockIndex) {
    // selection의 시작 블록이 끝 블록보다 node 인덱스가 작을 때,
    if (selectionStartChildNodeIndex < selectionEndChildNodeIndex) {
      rectOffset = selectionStartOffset;
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selectionStartBlockIndex,
        selectionStartChildNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }
    // selection의 시작 블록이 끝 블록보다 node 인덱스가 클 때,
    if (selectionStartChildNodeIndex > selectionEndChildNodeIndex) {
      rectOffset = selectionEndOffset;
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selectionStartBlockIndex,
        selectionEndChildNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }
    // selection의 시작 블록이 끝 블록보다 node 인덱스가 같을 때,
    if (selectionStartChildNodeIndex === selectionEndChildNodeIndex) {
      rectOffset = Math.min(selectionStartOffset, selectionEndOffset);
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selectionStartBlockIndex,
        selectionStartChildNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }
  }

  setMenuState(prev => ({
    ...prev,
    selectionMenuPosition: { x: left, y: top },
  }));

  // selection이 없을 때, 다른 곳 클릭시 메뉴 닫기
  if (
    (selectionStartBlockIndex === finalSelectionEndPosition.blockIndex &&
      selectionStartChildNodeIndex === finalSelectionEndPosition.childNodeIndex &&
      selectionStartOffset === finalSelectionEndPosition.offset) ||
    selectionStartChildNodeIndex === -1
  ) {
    setMenuState(prev => ({
      ...prev,
      isSelectionMenuOpen: false,
    }));
    return;
  }

  // selection이 있을 때, 메뉴 열기
  if (
    !(
      selectionStartBlockIndex === selectionEndBlockIndex &&
      selectionStartChildNodeIndex === selectionEndChildNodeIndex &&
      selectionStartOffset === selectionEndOffset
    )
  ) {
    setMenuState(prev => ({
      ...prev,
      isSelectionMenuOpen: true,
    }));
  }
};

export default handleMouseUp;
