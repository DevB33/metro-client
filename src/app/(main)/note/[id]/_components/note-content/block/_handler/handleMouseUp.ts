import ISelectionPosition from '@/types/selection-position';
import getSelectionInfo from '@/utils/getSelectionInfo';

const handleMouseUp = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
  setIsSelectionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectionMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) => {
  if (!blockRef.current || blockRef.current.length === 0) return;

  // selectionEndPosition 재설정
  const finalSelectionEndPosition = {
    blockIndex: selectionEndPosition.blockIndex,
    childNodeIndex: selectionEndPosition.childNodeIndex,
    offset: selectionEndPosition.offset,
  };

  if (index !== selectionEndPosition.blockIndex) {
    finalSelectionEndPosition.blockIndex = index;
  }

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);

  if (currentChildNodeIndex === -1) return;

  if (currentChildNodeIndex !== selectionEndPosition.childNodeIndex) {
    finalSelectionEndPosition.childNodeIndex = currentChildNodeIndex;
  }

  const { startOffset } = getSelectionInfo(0) || {};
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  if (startOffset !== undefined && charIdx !== startOffset) {
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
  }

  finalSelectionEndPosition.offset = charIdx;

  const getNodeStartBounds = (node: Node, nodeStartOffset: number) => {
    const range = document.createRange();
    if (node.nodeType === Node.TEXT_NODE) {
      // 텍스트 노드일 때
      range.setStart(node as Node, nodeStartOffset);
      range.setEnd(node as Node, nodeStartOffset);
    } else if (node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
      // span 같은 엘리먼트 노드에 텍스트가 있을 경우
      range.setStart(node.firstChild, nodeStartOffset);
      range.setEnd(node.firstChild, nodeStartOffset);
    } else {
      range.setStart(node as Node, nodeStartOffset);
      range.setEnd(node as Node, nodeStartOffset);
    }
    return range.getBoundingClientRect();
  };

  let left = 99999;
  let top = 0;
  let rectOffset = 0;

  if (selectionStartPosition.blockIndex < selectionEndPosition.blockIndex) {
    const selectionParent = blockRef.current[selectionStartPosition.blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    rectOffset = selectionStartPosition.offset;
    selectionChildNodes.forEach((childNode, idx) => {
      if (idx !== selectionStartPosition.childNodeIndex) return;
      const rect = getNodeStartBounds(childNode as Node, rectOffset);
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });
  }

  if (selectionStartPosition.blockIndex > selectionEndPosition.blockIndex) {
    const selectionParent = blockRef.current[selectionEndPosition.blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    rectOffset = selectionEndPosition.offset;
    selectionChildNodes.forEach((childNode, idx) => {
      if (idx !== selectionEndPosition.childNodeIndex) return;
      const rect = getNodeStartBounds(childNode as Node, rectOffset);
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });
  }

  if (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex) {
    const selectionParent = blockRef.current[selectionStartPosition.blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    if (selectionStartPosition.childNodeIndex < selectionEndPosition.childNodeIndex) {
      rectOffset = selectionStartPosition.offset;
      selectionChildNodes.forEach((childNode, idx) => {
        if (idx !== selectionStartPosition.childNodeIndex) return;
        const rect = getNodeStartBounds(childNode as Node, rectOffset);
        left = Math.min(left, rect.left);
        top = Math.max(top, rect.top);
      });
    }
    if (selectionStartPosition.childNodeIndex > selectionEndPosition.childNodeIndex) {
      rectOffset = selectionEndPosition.offset;
      selectionChildNodes.forEach((childNode, idx) => {
        if (idx !== selectionEndPosition.childNodeIndex) return;
        const rect = getNodeStartBounds(childNode as Node, rectOffset);
        left = Math.min(left, rect.left);
        top = Math.max(top, rect.top);
      });
    }
    if (selectionStartPosition.childNodeIndex === selectionEndPosition.childNodeIndex) {
      rectOffset = Math.min(selectionStartPosition.offset, selectionEndPosition.offset);
      selectionChildNodes.forEach((childNode, idx) => {
        if (idx !== selectionStartPosition.childNodeIndex) return;
        const rect = getNodeStartBounds(childNode as Node, rectOffset);
        left = Math.min(left, rect.left);
        top = Math.max(top, rect.top);
      });
    }
  }

  setSelectionMenuPosition({
    x: left,
    y: top,
  });

  // selection이 없을 때, 다른 곳 클릭시 메뉴 닫기
  if (
    (selectionStartPosition.blockIndex === finalSelectionEndPosition.blockIndex &&
      selectionStartPosition.childNodeIndex === finalSelectionEndPosition.childNodeIndex &&
      selectionStartPosition.offset === finalSelectionEndPosition.offset) ||
    selectionStartPosition.childNodeIndex === -1
  ) {
    setIsSelectionMenuOpen(false);
    return;
  }

  setIsSelectionMenuOpen(true);
};

export default handleMouseUp;
