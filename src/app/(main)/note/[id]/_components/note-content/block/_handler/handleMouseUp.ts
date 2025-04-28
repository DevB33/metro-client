import IMenuState from '@/types/menu-type';
import ISelectionPosition from '@/types/selection-position';
import getSelectionInfo from '@/utils/getSelectionInfo';

const handleMouseUp = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selection: ISelectionPosition,
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>,
) => {
  if (!blockRef.current || blockRef.current.length === 0) return;

  // selection.end 재설정
  const finalSelectionEndPosition = {
    blockIndex: selection.end.blockIndex,
    childNodeIndex: selection.end.childNodeIndex,
    offset: selection.end.offset,
  };

  if (index !== selection.end.blockIndex) {
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

  if (currentChildNodeIndex !== selection.end.childNodeIndex) {
    finalSelectionEndPosition.childNodeIndex = currentChildNodeIndex;
  }

  const { startOffset } = getSelectionInfo(0) || {};
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  if (startOffset !== undefined && charIdx !== startOffset) {
    const windowSelection = window.getSelection();
    if (windowSelection) windowSelection.removeAllRanges();
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

  if (selection.start.blockIndex < selection.end.blockIndex) {
    const selectionParent = blockRef.current[selection.start.blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    rectOffset = selection.start.offset;
    selectionChildNodes.forEach((childNode, idx) => {
      if (idx !== selection.start.childNodeIndex) return;
      const rect = getNodeStartBounds(childNode as Node, rectOffset);
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });
  }

  if (selection.start.blockIndex > selection.end.blockIndex) {
    const selectionParent = blockRef.current[selection.end.blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    rectOffset = selection.end.offset;
    selectionChildNodes.forEach((childNode, idx) => {
      if (idx !== selection.end.childNodeIndex) return;
      const rect = getNodeStartBounds(childNode as Node, rectOffset);
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });
  }

  if (selection.start.blockIndex === selection.end.blockIndex) {
    const selectionParent = blockRef.current[selection.start.blockIndex];
    const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);
    if (selection.start.childNodeIndex < selection.end.childNodeIndex) {
      rectOffset = selection.start.offset;
      selectionChildNodes.forEach((childNode, idx) => {
        if (idx !== selection.start.childNodeIndex) return;
        const rect = getNodeStartBounds(childNode as Node, rectOffset);
        left = Math.min(left, rect.left);
        top = Math.max(top, rect.top);
      });
    }
    if (selection.start.childNodeIndex > selection.end.childNodeIndex) {
      rectOffset = selection.end.offset;
      selectionChildNodes.forEach((childNode, idx) => {
        if (idx !== selection.end.childNodeIndex) return;
        const rect = getNodeStartBounds(childNode as Node, rectOffset);
        left = Math.min(left, rect.left);
        top = Math.max(top, rect.top);
      });
    }
    if (selection.start.childNodeIndex === selection.end.childNodeIndex) {
      rectOffset = Math.min(selection.start.offset, selection.end.offset);
      selectionChildNodes.forEach((childNode, idx) => {
        if (idx !== selection.start.childNodeIndex) return;
        const rect = getNodeStartBounds(childNode as Node, rectOffset);
        left = Math.min(left, rect.left);
        top = Math.max(top, rect.top);
      });
    }
  }

  setMenuState(prev => ({
    ...prev,
    selectionMenuPosition: { x: left, y: top },
  }));

  // selection이 없을 때, 다른 곳 클릭시 메뉴 닫기
  if (
    (selection.start.blockIndex === finalSelectionEndPosition.blockIndex &&
      selection.start.childNodeIndex === finalSelectionEndPosition.childNodeIndex &&
      selection.start.offset === finalSelectionEndPosition.offset) ||
    selection.start.childNodeIndex === -1
  ) {
    setMenuState(prev => ({
      ...prev,
      isSelectionMenuOpen: false,
    }));
    return;
  }

  setMenuState(prev => ({
    ...prev,
    isSelectionMenuOpen: true,
  }));
};

export default handleMouseUp;
