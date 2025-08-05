import ISelectionPosition from '@/types/selection-position';

const handleMouseLeave = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  isDragging: React.RefObject<boolean>,
  isUp: React.RefObject<boolean>,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selection: ISelectionPosition,
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
) => {
  console.log(isDragging.current);
  if (!isDragging.current) return;

  const windowSelection = window.getSelection();
  if (windowSelection) windowSelection.removeAllRanges();

  const fakeBlock = document.getElementById(`fakeBlock-${index}`);

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  // 시작 블록에서 떠날 때
  if (index === selection.start.blockIndex && index === selection.end.blockIndex) {
    // fakeBlock로 떠날 때, position 변화 x
    if (event.relatedTarget instanceof HTMLElement && fakeBlock?.contains(event.relatedTarget)) {
      return;
    }

    // 아래로 떠날 때
    if (!isUp.current) {
      childNodes.forEach((childNode, idx) => {
        if (idx === childNodes.length - 1) {
          setSelection(prev => ({
            ...prev,
            end: { ...prev.end, childNodeIndex: idx, offset: childNode.textContent?.length || 0 },
          }));
        }
      });
    }

    // 위로 떠날 때
    if (isUp.current) {
      setSelection(prev => ({
        ...prev,
        end: { ...prev.end, childNodeIndex: 0, offset: 0 },
      }));
    }
  }

  // 아래로 드래그한 상태에서 블록을 떠날 때
  if (selection.start.blockIndex < selection.end.blockIndex) {
    // 위로 드래그 할 때
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && isUp.current) {
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }

    // 아래로 드래그 할 때
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && !isUp.current) {
      childNodes.forEach((childNode, idx) => {
        if (idx === childNodes.length - 1) {
          setSelection(prev => ({
            ...prev,
            end: { ...prev.end, childNodeIndex: idx, offset: childNode.textContent?.length || 0 },
          }));
        }
      });
    }
  }

  // 위로 드래그한 상태에서 블록을 떠날 때
  if (selection.start.blockIndex > selection.end.blockIndex) {
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && isUp.current) {
      console.log('여기');
      setSelection(prev => ({
        ...prev,
        end: { ...prev.end, childNodeIndex: 0, offset: 0 },
      }));
    }
  }
};

export default handleMouseLeave;
