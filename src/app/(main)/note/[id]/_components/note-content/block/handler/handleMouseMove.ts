import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import getSelectionInfo from '@/utils/getSelectionInfo';

const isCollapsedSelection = (selection: ISelectionPosition) => {
  if (selection.start.blockIndex !== selection.end.blockIndex) return false;
  if (selection.start.childNodeIndex !== selection.end.childNodeIndex) return false;
  if (selection.start.offset !== selection.end.offset) return false;
  return true;
};

const handleMouseMove = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  blockList: ITextBlock[],
  isDragging: React.RefObject<boolean>,
  selection: ISelectionPosition,
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
) => {
  if (!isDragging.current) return;

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);
  const { startOffset } = getSelectionInfo(0) || {};
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  if (currentChildNodeIndex === -1) return;

  // 셀렉션이 만들어 질 때 기본 셀렉션 지우기
  if (startOffset !== undefined && charIdx !== startOffset) {
    const windowSelection = window.getSelection();
    if (windowSelection) windowSelection.removeAllRanges();
  }

  setSelection(prev => ({
    ...prev,
    end: { blockId: blockList[index].id, blockIndex: index, childNodeIndex: currentChildNodeIndex, offset: charIdx },
  }));

  if (isCollapsedSelection(selection)) {
    const newRange = document.createRange();

    if (newRange) {
      const windowSelection = window.getSelection();
      if (currentChildNodeIndex === -1) return;

      const targetNode = blockRef.current[index]?.childNodes[currentChildNodeIndex];

      if (!targetNode) return;
      if (targetNode.nodeType === Node.TEXT_NODE) {
        // 텍스트 노드일 때
        newRange.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex] as Node, charIdx);
      } else if (targetNode.firstChild && targetNode.firstChild.nodeType === Node.TEXT_NODE) {
        // span 같은 엘리먼트 노드에 텍스트가 있을 경우
        newRange.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex].firstChild as Node, charIdx);
      }

      windowSelection?.addRange(newRange);
    }
  }
};

export default handleMouseMove;
