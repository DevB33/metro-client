import ISelectionPosition from '@/types/selection-position';

const handleMouseUp = (
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
  setIsSelectionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectionMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) => {
  if (!blockRef.current || blockRef.current.length === 0) return;

  const startParent = blockRef.current[selectionStartPosition.blockIndex];
  const endParent = blockRef.current[selectionEndPosition.blockIndex];
  if (!startParent || !endParent) return;

  const startRect = startParent.getBoundingClientRect();
  const startX = startRect.left;
  const startY = startRect.top;

  const endRect = endParent.getBoundingClientRect();
  const endX = endRect.left;
  const endY = endRect.top;

  // selection이 없을 때, 다른 곳 클릭시 메뉴 닫기
  if (
    (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex &&
      selectionStartPosition.childNodeIndex === selectionEndPosition.childNodeIndex &&
      selectionStartPosition.offset === selectionEndPosition.offset) ||
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
