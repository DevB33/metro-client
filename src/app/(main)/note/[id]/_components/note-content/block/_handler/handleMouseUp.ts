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

  const getNodeBounds = (node: Node, nodeStartOffset: number, endOffset: number) => {
    const range = document.createRange();
    range.setStart(node as Node, nodeStartOffset);
    range.setEnd(node as Node, endOffset);
    return range.getBoundingClientRect();
  };

  let left = 99999;
  let top = 0;

  const selectionParent =
    selectionStartPosition.blockIndex < selectionEndPosition.blockIndex
      ? blockRef.current[selectionStartPosition.blockIndex]
      : blockRef.current[selectionEndPosition.blockIndex];
  const selectionChildNodes = Array.from(selectionParent?.childNodes as NodeListOf<HTMLElement>);

  selectionChildNodes.forEach(childNode => {
    const rect = getNodeBounds(
      childNode as Node,
      selectionStartPosition.blockIndex < selectionEndPosition.blockIndex
        ? selectionStartPosition.offset
        : selectionEndPosition.offset,
      parent?.textContent?.length || (0 as number),
    );
    left = Math.min(left, rect.left);
    top = Math.max(top, rect.top);
  });

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
