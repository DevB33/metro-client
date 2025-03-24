import ITextBlock from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';

const handleMouseDown = (
  event: React.MouseEvent<HTMLDivElement>,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
  blockList: ITextBlock[],
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  setKey: React.Dispatch<React.SetStateAction<number>>,
  setSelectionStartPosition: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
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

  setSelectionStartPosition({
    blockIndex: index,
    childNodeIndex: currentChildNodeIndex,
    offset: charIdx,
  });

  setTimeout(() => {
    if (range) {
      if (blockList[index].type === 'ul' || blockList[index].type === 'ol') {
        (blockRef.current[index]?.parentNode?.parentNode?.parentNode as HTMLElement)?.focus();
      } else if (blockList[index].type === 'quote') {
        (blockRef.current[index]?.parentNode?.parentNode as HTMLElement)?.focus();
      } else {
        (blockRef.current[index]?.parentNode as HTMLElement)?.focus();
      }
      const selection = window.getSelection();
      if (currentChildNodeIndex === -1) return;
      range?.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex] as Node, charIdx);

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, 0);
};

export default handleMouseDown;
