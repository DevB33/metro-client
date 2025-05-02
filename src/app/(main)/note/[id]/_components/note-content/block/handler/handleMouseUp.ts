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

  const getNodeBounds = (node: Node, startNodeOffset: number, endNodeOffset: number) => {
    const range = document.createRange();

    let targetNode = node;
    // span 같은 element면 그 안에 있는 텍스트 노드로 변경
    if (node.nodeType !== Node.TEXT_NODE) {
      const firstTextNode = node.childNodes[0];
      if (!firstTextNode || firstTextNode.nodeType !== Node.TEXT_NODE) {
        return new DOMRect();
      }
      targetNode = firstTextNode;
    }

    range.setStart(targetNode as Node, startNodeOffset);
    range.setEnd(targetNode as Node, endNodeOffset);
    return range.getBoundingClientRect();
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

  if (selection.start.blockIndex < selection.end.blockIndex) {
    rectOffset = selection.start.offset;
    const { left: newLeft, top: newTop } = getBoundsForSelection(
      selection.start.blockIndex,
      selection.start.childNodeIndex,
      rectOffset,
    );
    left = Math.min(left, newLeft);
    top = Math.max(top, newTop);
  }

  // selection의 시작 블록이 끝 블록보다 인덱스가 클 때,
  if (selection.start.blockIndex > selection.end.blockIndex) {
    rectOffset = selection.end.offset;
    const { left: newLeft, top: newTop } = getBoundsForSelection(
      selection.end.blockIndex,
      selection.end.childNodeIndex,
      rectOffset,
    );
    left = Math.min(left, newLeft);
    top = Math.max(top, newTop);
  }

  // selection의 시작 블록이 끝 블록보다 인덱스가 같을 때,
  if (selection.start.blockIndex === selection.end.blockIndex) {
    // selection의 시작 블록이 끝 블록보다 node 인덱스가 작을 때,
    if (selection.start.childNodeIndex < selection.end.childNodeIndex) {
      rectOffset = selection.start.offset;
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selection.start.blockIndex,
        selection.start.childNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }
    // selection의 시작 블록이 끝 블록보다 node 인덱스가 클 때,
    if (selection.start.childNodeIndex > selection.end.childNodeIndex) {
      rectOffset = selection.end.offset;
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selection.start.blockIndex,
        selection.end.childNodeIndex,
        rectOffset,
      );
      left = Math.min(left, newLeft);
      top = Math.max(top, newTop);
    }
    // selection의 시작 블록이 끝 블록보다 node 인덱스가 같을 때,
    if (selection.start.childNodeIndex === selection.end.childNodeIndex) {
      rectOffset = Math.min(selection.start.offset, selection.end.offset);
      const { left: newLeft, top: newTop } = getBoundsForSelection(
        selection.start.blockIndex,
        selection.start.childNodeIndex,
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
