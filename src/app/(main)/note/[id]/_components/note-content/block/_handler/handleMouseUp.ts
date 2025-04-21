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

  const startParent = blockRef.current[selectionStartPosition.blockIndex];
  const endParent = blockRef.current[finalSelectionEndPosition.blockIndex];
  if (!startParent || !endParent) return;

  const startRect = startParent.getBoundingClientRect();
  const startX = startRect.left;
  const startY = startRect.top;

  const endRect = endParent.getBoundingClientRect();
  const endX = endRect.left;
  const endY = endRect.top;

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

  // 위에서 아래로 드래그시 메뉴 위치 설정
  if (startY <= endY) {
    setSelectionMenuPosition({ x: startX, y: startY });
  }

  // 아래에서 위로 드래그시 메뉴 위치 설정
  if (startY > endY) {
    setSelectionMenuPosition({ x: endX, y: endY });
  }

  setIsSelectionMenuOpen(true);
};

export default handleMouseUp;
