import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';

const handleMouseDown = (
  event: React.MouseEvent<HTMLDivElement>,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
  blockList: ITextBlock[],
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  setKey: React.Dispatch<React.SetStateAction<number>>,
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
) => {
  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;

  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);

  setIsDragging(true);
  setIsTyping(false);
  setKey(Math.random());

  const range = document.createRange();
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  setSelection({
    start: { blockIndex: index, childNodeIndex: currentChildNodeIndex, offset: charIdx },
    end: { blockIndex: index, childNodeIndex: currentChildNodeIndex, offset: charIdx },
  });

  setTimeout(() => {
    // 빈 블록일 때 클릭 한 블록에 focus
    // block의 타입마다 blockRef의 깊이가 달라서 type에 맞게 focus
    if (blockList[index].children.length === 1 && blockList[index].children[0].content === '') {
      if (blockList[index].type === 'ul' || blockList[index].type === 'ol') {
        (blockRef.current[index]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
      } else if (blockList[index].type === 'quote') {
        (blockRef.current[index]?.parentNode?.parentNode as HTMLElement)?.focus();
      } else {
        (blockRef.current[index]?.parentNode as HTMLElement)?.focus();
      }
    }

    if (range) {
      const selection = window.getSelection();
      if (currentChildNodeIndex === -1) return;

      const targetNode = blockRef.current[index]?.childNodes[currentChildNodeIndex];

      if (!targetNode) return;
      if (targetNode.nodeType === Node.TEXT_NODE) {
        // 텍스트 노드일 때
        range.setStart(targetNode, charIdx);
      } else if (targetNode.firstChild && targetNode.firstChild.nodeType === Node.TEXT_NODE) {
        // span 같은 엘리먼트 노드에 텍스트가 있을 경우
        range.setStart(targetNode.firstChild, charIdx);
      }

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, 0);
};

export default handleMouseDown;
